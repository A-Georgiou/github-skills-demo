#!/bin/bash

# Test suite for github-skills-demo repository
# This script validates the repository structure and file contents

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Get the repository root directory
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Helper function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    
    if eval "$test_command"; then
        echo -e "${GREEN}✓ PASS${NC}: $test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}: $test_name"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

echo "Running tests for github-skills-demo repository..."
echo "Repository root: $REPO_ROOT"
echo "=========================================="

# Test 1: README.md exists
run_test "README.md exists" "[ -f '$REPO_ROOT/README.md' ]"

# Test 2: README.md is not empty
run_test "README.md is not empty" "[ -s '$REPO_ROOT/README.md' ]"

# Test 3: README.md contains expected title
run_test "README.md contains project title" "grep -q 'github-skills-demo' '$REPO_ROOT/README.md'"

# Test 4: Repository has a .git directory (is a git repository)
run_test "Repository is a git repository" "[ -d '$REPO_ROOT/.git' ]"

# Test 5: Test file exists
run_test "Test file exists" "[ -f '$REPO_ROOT/++.test_file.c++' ]"

# Test 6: Test file contains expected content
run_test "Test file contains expected content" "grep -q 'Test file' '$REPO_ROOT/++.test_file.c++'"

# Test 7: Tests directory exists
run_test "Tests directory exists" "[ -d '$REPO_ROOT/tests' ]"

echo "=========================================="
echo "Test Summary:"
echo "  Total tests: $TESTS_RUN"
echo -e "  ${GREEN}Passed: $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "  ${RED}Failed: $TESTS_FAILED${NC}"
fi

# Exit with appropriate code
if [ $TESTS_FAILED -gt 0 ]; then
    exit 1
else
    echo -e "\n${GREEN}All tests passed!${NC}"
    exit 0
fi
