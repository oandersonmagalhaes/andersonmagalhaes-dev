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

.DEFAULT_GOAL := help
.PHONY: help install dev build start lint storybook storybook-build \
        check clean clean-build clean-deps reinstall

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
# Storybook
# -----------------------------------------------------------------------------

storybook: ## Start Storybook dev server (http://localhost:6006)
	$(NPM) run storybook

storybook-build: ## Build the static Storybook into ./storybook-static
	$(NPM) run build-storybook

# -----------------------------------------------------------------------------
# Quality gate
# -----------------------------------------------------------------------------

check: lint build storybook-build ## Lint + Next build + Storybook build (CI gate)
	@printf "\n\033[32m✓ All checks passed.\033[0m\n"

# -----------------------------------------------------------------------------
# Cleanup
# -----------------------------------------------------------------------------

clean-build: ## Remove .next, out, storybook-static
	rm -rf $(NEXT_DIR) $(OUT_DIR) $(SB_DIR)

clean-deps: ## Remove node_modules
	rm -rf node_modules

clean: clean-build ## Alias of clean-build (does NOT remove node_modules)
