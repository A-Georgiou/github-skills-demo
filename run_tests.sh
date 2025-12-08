#!/bin/bash

# Main test runner for github-skills-demo repository
# Executes all test scripts in the tests directory

echo "Starting test suite for github-skills-demo"
echo "=========================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TESTS_DIR="$SCRIPT_DIR/tests"
OVERALL_EXIT_CODE=0

# Find and execute all test scripts
for test_file in "$TESTS_DIR"/test_*.sh; do
    if [ -f "$test_file" ]; then
        echo ""
        echo "Running: $(basename "$test_file")"
        echo "------------------------------------------"
        bash "$test_file"
        if [ $? -ne 0 ]; then
            OVERALL_EXIT_CODE=1
        fi
    fi
done

echo ""
echo "=========================================="
if [ $OVERALL_EXIT_CODE -eq 0 ]; then
    echo "All test suites passed!"
else
    echo "Some tests failed!"
fi

exit $OVERALL_EXIT_CODE
