#!/bin/bash

# Script to remove duplicate GraphQL query exports
# This will keep the first occurrence of each duplicate and remove subsequent ones

QUERIES_FILE="/Users/jnaneshshetty/Documents/Kalpla-final/kalpla-platform/src/graphql/queries.ts"

echo "🔍 Finding duplicate GraphQL query exports..."

# Get all duplicate export names
DUPLICATES=$(grep -n "export const" "$QUERIES_FILE" | awk -F: '{print $2}' | sort | uniq -c | awk '$1 > 1 {print $2}')

echo "Found duplicates:"
echo "$DUPLICATES"

# Process each duplicate
for export_name in $DUPLICATES; do
    echo ""
    echo "Processing: $export_name"
    
    # Get line numbers for this export
    LINES=$(grep -n "export const $export_name" "$QUERIES_FILE" | awk -F: '{print $1}')
    
    # Convert to array
    LINE_ARRAY=($LINES)
    
    # Keep the first occurrence, remove the rest
    if [ ${#LINE_ARRAY[@]} -gt 1 ]; then
        echo "  Keeping line ${LINE_ARRAY[0]}, removing lines: ${LINE_ARRAY[@]:1}"
        
        # For each duplicate line (except the first), remove the entire query block
        for i in "${LINE_ARRAY[@]:1}"; do
            echo "  Removing duplicate at line $i"
            
            # Find the end of the query block (next export or end of file)
            END_LINE=$(awk -v start="$i" '
                NR >= start && /^export const/ && NR > start { print NR-1; exit }
                END { print NR }
            ' "$QUERIES_FILE")
            
            echo "  Query block ends at line $END_LINE"
            
            # Remove the query block (including the comment before it if it's a section header)
            sed -i.bak "${i},${END_LINE}d" "$QUERIES_FILE"
        done
    fi
done

echo ""
echo "✅ Duplicate removal complete!"
echo "Backup created as: ${QUERIES_FILE}.bak"
