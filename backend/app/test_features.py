from app.services.feature_service import (
    load_csv,
    validate_csv,
    extract_features,
    create_network_states
)


file_path = "test.csv"


# 1. Load CSV
df = load_csv(file_path)

print("\nOriginal Data:")
print(df)


# 2. Validate CSV
validation = validate_csv(df)

print("\nValidation:")
print(validation)


if not validation["valid"]:
    print("\nCSV validation failed.")
    exit()


# 3. Extract features
features = extract_features(df)

print("\nExtracted Features:")
print(features)


# 4. Create network states
states = create_network_states(features)

print("\nNetwork States:")
print(states)