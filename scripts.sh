#!/bin/bash

OUTPUT_FILE="output.txt"
COMPONENTS_DIR="src/components"
TESTS_DIR="src/__tests__"
README_FILE="README.md"

# Create or empty the output file
> "$OUTPUT_FILE"

# Generate directory structure without node_modules
echo "## Directory Structure (Excluding node_modules)" >> "$OUTPUT_FILE"
echo "----------------------------" >> "$OUTPUT_FILE"
tree -I 'node_modules' >> "$OUTPUT_FILE"
echo -e "\n" >> "$OUTPUT_FILE"

# Add header for components
echo "## Components" >> "$OUTPUT_FILE"
echo "----------------------------" >> "$OUTPUT_FILE"

# Add components' file paths and contents
for file in "$COMPONENTS_DIR"/*.tsx; do
  if [ -f "$file" ]; then
    echo "File: $file" >> "$OUTPUT_FILE"
    echo "----------------------------" >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo -e "\n" >> "$OUTPUT_FILE"
  fi
done

# Add header for test files
echo "## Tests" >> "$OUTPUT_FILE"
echo "----------------------------" >> "$OUTPUT_FILE"

# Add test files' file paths and contents
find "$TESTS_DIR" -name "*.test.ts*" | while read -r file; do
  if [ -f "$file" ]; then
    echo "File: $file" >> "$OUTPUT_FILE"
    echo "----------------------------" >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo -e "\n" >> "$OUTPUT_FILE"
  fi
done

# Add README.md content
if [ -f "$README_FILE" ]; then
  echo "## README.md" >> "$OUTPUT_FILE"
  echo "----------------------------" >> "$OUTPUT_FILE"
  cat "$README_FILE" >> "$OUTPUT_FILE"
  echo -e "\n" >> "$OUTPUT_FILE"
else
  echo "README.md not found!" >> "$OUTPUT_FILE"
fi

echo "All contents, including the directory structure, have been written to $OUTPUT_FILE."
