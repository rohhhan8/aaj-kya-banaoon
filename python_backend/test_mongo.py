"""
Test file for the simple file-based database
"""

# This script tests the file-based database functionality

try:
    from database import get_database, get_collection, insert_one, find_one, find_many
    print("Database module imported successfully!")
    
    # Test basic database operations
    print("Testing database operations...")
    
    # Insert a test document
    test_data = {
        "name": "Test Dish",
        "description": "A test dish for database verification",
        "tags": ["Test", "Sample"]
    }
    
    doc_id = insert_one("dishes", test_data)
    print(f"Inserted document with ID: {doc_id}")
    
    # Find the document
    found = find_one("dishes", {"name": "Test Dish"})
    if found:
        print(f"Found document: {found['name']}")
    else:
        print("Document not found!")
    
    # Get all documents in the collection
    all_docs = find_many("dishes", {})
    print(f"Total documents in collection: {len(all_docs)}")
    
    print("Database test completed successfully!")
    
except ImportError as e:
    print(f"ERROR: Import error: {e}")
    
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
    
print("Test complete.") 