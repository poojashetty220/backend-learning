#!/bin/bash

# Always work from the script's directory (project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"
SERVICES_DIR="$ROOT_DIR/services"

run_tests() {
    local current_service="$1"
    echo "Testing service: $current_service"

    # Check possible locations for dredd.yml
    local dredd_file_root="$SERVICES_DIR/$current_service/dredd.yml"
    local dredd_file_docs="$SERVICES_DIR/$current_service/docs/dredd.yml"

    local dredd_file=""
    local dredd_dir=""

    if [ -f "$dredd_file_root" ]; then
        dredd_file="$dredd_file_root"
        dredd_dir="$SERVICES_DIR/$current_service"
    elif [ -f "$dredd_file_docs" ]; then
        dredd_file="$dredd_file_docs"
        dredd_dir="$SERVICES_DIR/$current_service/docs"
    fi

    # If no file found
    if [ -z "$dredd_file" ]; then
        echo "⚠️  No dredd.yml found for service: $current_service"
        return 1
    fi

    # Run Dredd tests
    cd "$dredd_dir" || exit
    dredd "$(basename "$dredd_file")"
    exit_status=$?
    cd "$ROOT_DIR" || exit

    if [ $exit_status -ne 0 ]; then
        echo "❌ Dredd tests failed in folder: $current_service"
        exit $exit_status
    fi

    echo "✅ Dredd tests completed for $current_service."
}

# If service name provided
if [ -n "$1" ]; then
    run_tests "$1"
else
    # Run for all services
    for folder in "$SERVICES_DIR"/*/; do
        folder_name=$(basename "$folder")
        run_tests "$folder_name"
    done
fi

echo "🎉 All Dredd tests completed."
