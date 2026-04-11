## andersonmagalhaes.dev — task runner
##
## Thin wrapper around npm scripts so common workflows are one keystroke.
## Run `make` (or `make help`) to list every target.

# -----------------------------------------------------------------------------
# Config
# -----------------------------------------------------------------------------

NPM       ?= npm
NEXT_DIR   = .next
OUT_DIR    = out
SB_DIR     = storybook-static
COV_DIR    = coverage
SEC_COMPOSE = docker-compose.security.yml

.DEFAULT_GOAL := help
.PHONY: help install dev build start lint test test-watch coverage \
        storybook storybook-build check clean clean-build clean-deps reinstall \
        sonar sonar-up sonar-down sonar-logs sonar-scan sonar-token \
        trivy-scan security

# -----------------------------------------------------------------------------
# Help
# -----------------------------------------------------------------------------

help: ## Show this help
	@printf "\n\033[1mandersonmagalhaes.dev — make targets\033[0m\n\n"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@printf "\n"

# -----------------------------------------------------------------------------
# Dependencies
# -----------------------------------------------------------------------------

install: ## Install npm dependencies
	$(NPM) install

reinstall: clean-deps install ## Wipe node_modules and reinstall

# -----------------------------------------------------------------------------
# Dev / build
# -----------------------------------------------------------------------------

dev: ## Start Next.js dev server (http://localhost:3000)
	$(NPM) run dev

build: ## Static export to ./out (runs postbuild .htaccess copy)
	$(NPM) run build

start: ## Serve a previously built app (rarely used with static export)
	$(NPM) run start

lint: ## Run ESLint
	$(NPM) run lint

# -----------------------------------------------------------------------------
# Tests
# -----------------------------------------------------------------------------

test: ## Run unit tests once (vitest)
	$(NPM) run test

test-watch: ## Run unit tests in watch mode
	$(NPM) run test:watch

coverage: ## Run unit tests with coverage report (text + html in ./coverage)
	$(NPM) run test:coverage

# -----------------------------------------------------------------------------
# Storybook
# -----------------------------------------------------------------------------

storybook: ## Start Storybook dev server (http://localhost:6006)
	$(NPM) run storybook

storybook-build: ## Build the static Storybook into ./storybook-static
	$(NPM) run build-storybook

# -----------------------------------------------------------------------------
# Security (mirrors the GitHub Actions Security workflow)
#
# `make security` runs the SAST/SCA gate locally via Trivy — fails on HIGH+
# the same way CI does. ZAP DAST is omitted from the local default because it
# requires a built+served site; use the workflow for that.
#
# `make sonar` is a one-shot: it starts the container, waits for it to become
# healthy, generates fresh coverage if needed, mints an analysis token through
# the Sonar API, runs sonar-scanner, and prints the dashboard URL. No manual
# password reset, no token juggling.
# -----------------------------------------------------------------------------

SONAR_URL          ?= http://localhost:9000
SONAR_USER         ?= admin
SONAR_DEFAULT_PWD  ?= admin
SONAR_PWD          ?= admin-local-1
SONAR_PROJECT_KEY  ?= andersonmagalhaes-dev
SONAR_TOKEN_NAME   ?= make-sonar-scan

sonar: sonar-scan ## One-shot: start SonarQube, scan the project, print dashboard URL

sonar-up: ## Start the local SonarQube container and wait until it is healthy
	docker compose -f $(SEC_COMPOSE) up -d --wait sonarqube
	@printf "\n\033[36mSonarQube ready at \033[1m$(SONAR_URL)\033[0m\033[36m\033[0m\n"

sonar-down: ## Stop the local SonarQube container (volumes preserved)
	docker compose -f $(SEC_COMPOSE) down

sonar-logs: ## Tail SonarQube logs
	docker compose -f $(SEC_COMPOSE) logs -f sonarqube

sonar-token: ## Bootstrap admin password and mint a fresh analysis token (prints to stdout)
	@curl -s -u $(SONAR_USER):$(SONAR_DEFAULT_PWD) -X POST "$(SONAR_URL)/api/users/change_password" \
		-d "login=$(SONAR_USER)&previousPassword=$(SONAR_DEFAULT_PWD)&password=$(SONAR_PWD)" > /dev/null 2>&1 || true
	@curl -s -u $(SONAR_USER):$(SONAR_PWD) -X POST "$(SONAR_URL)/api/user_tokens/revoke" \
		-d "name=$(SONAR_TOKEN_NAME)" > /dev/null 2>&1 || true
	@curl -s -u $(SONAR_USER):$(SONAR_PWD) -X POST "$(SONAR_URL)/api/user_tokens/generate" \
		-d "name=$(SONAR_TOKEN_NAME)&type=GLOBAL_ANALYSIS_TOKEN" \
		| python3 -c "import sys,json; print(json.load(sys.stdin)['token'])"

sonar-scan: sonar-up ## Run sonar-scanner against the local SonarQube (auto-bootstraps token + coverage)
	@if [ ! -f coverage/lcov.info ]; then \
		printf "\033[36m→ generating coverage report (coverage/lcov.info missing)\033[0m\n"; \
		$(MAKE) --no-print-directory coverage; \
	fi
	@printf "\033[36m→ minting Sonar analysis token\033[0m\n"
	@set -e; \
	TOKEN="$${SONAR_TOKEN}"; \
	if [ -z "$$TOKEN" ]; then \
		curl -s -u $(SONAR_USER):$(SONAR_DEFAULT_PWD) -X POST "$(SONAR_URL)/api/users/change_password" \
			-d "login=$(SONAR_USER)&previousPassword=$(SONAR_DEFAULT_PWD)&password=$(SONAR_PWD)" > /dev/null 2>&1 || true; \
		curl -s -u $(SONAR_USER):$(SONAR_PWD) -X POST "$(SONAR_URL)/api/user_tokens/revoke" \
			-d "name=$(SONAR_TOKEN_NAME)" > /dev/null 2>&1 || true; \
		TOKEN=$$(curl -s -u $(SONAR_USER):$(SONAR_PWD) -X POST "$(SONAR_URL)/api/user_tokens/generate" \
			-d "name=$(SONAR_TOKEN_NAME)&type=GLOBAL_ANALYSIS_TOKEN" \
			| python3 -c "import sys,json; print(json.load(sys.stdin)['token'])"); \
	fi; \
	if [ -z "$$TOKEN" ]; then \
		printf "\033[31m✗ Failed to obtain a Sonar token. Is SonarQube reachable at $(SONAR_URL)?\033[0m\n"; \
		exit 1; \
	fi; \
	printf "\033[36m→ running sonar-scanner-cli\033[0m\n"; \
	docker run --rm --network host \
		-e SONAR_TOKEN=$$TOKEN \
		-v "$$PWD:/usr/src" \
		sonarsource/sonar-scanner-cli
	@printf "\n\033[32m✓ Dashboard: \033[1m$(SONAR_URL)/dashboard?id=$(SONAR_PROJECT_KEY)\033[0m\n"

trivy-scan: ## Run Trivy filesystem scan locally (fails on HIGH/CRITICAL)
	docker compose -f $(SEC_COMPOSE) run --rm trivy

security: trivy-scan ## Local security gate (Trivy fs scan; same threshold as CI)
	@printf "\n\033[32m✓ Local security scan passed.\033[0m\n"

# -----------------------------------------------------------------------------
# Quality gate
# -----------------------------------------------------------------------------

check: lint test build storybook-build ## Lint + tests + Next build + Storybook build (CI gate)
	@printf "\n\033[32m✓ All checks passed.\033[0m\n"

# -----------------------------------------------------------------------------
# Cleanup
# -----------------------------------------------------------------------------

clean-build: ## Remove .next, out, storybook-static, coverage, .scannerwork
	rm -rf $(NEXT_DIR) $(OUT_DIR) $(SB_DIR) $(COV_DIR) .scannerwork

clean-deps: ## Remove node_modules
	rm -rf node_modules

clean: clean-build ## Alias of clean-build (does NOT remove node_modules)
