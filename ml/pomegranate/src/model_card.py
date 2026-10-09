MODEL_CARD_FIELDS = {
    'model_name': 'AGROBRIDGE Pomegranate Fruit Disease V1',
    'scope': 'pomegranate fruit image screening and early detection',
    'architecture': 'efficientnet_b0',
    'classes': 5,
    'class_labels': [
        'Healthy',
        'Anthracnose',
        'Bacterial_Blight',
        'Alternaria',
        'Cercospora'
    ],
    'rejection_threshold': 0.55,
    'training_data': 'cloud-audited licensed datasets only (Kaggle/Mendeley)',
    'limitations': [
        'Screening tool — not a substitute for agricultural laboratory pathology',
        'Scoped specifically to pomegranate fruit surfaces (rind/calyx)',
        'Low-confidence images (<0.55 probability) are strictly rejected to prevent forced misclassification',
        'Field agronomist validation recommended for severe economic threats like Bacterial Blight (Telya)',
    ],
}
