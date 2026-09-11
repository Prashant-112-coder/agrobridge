export const diseases=[
{id:'D001',name:'Bacterial blight',type:'Bacterial',risk:'High',symptoms:['water-soaked lesions','dark leaf/fruit spots','twig cankers','fruit cracking'],management:['clean planting material','orchard sanitation','tool disinfection','canopy airflow','current label-approved bactericide options only with expert guidance']},
{id:'D002',name:'Alternaria fruit and leaf spot',type:'Fungal',risk:'High',symptoms:['brown leaf spots','dark fruit lesions','premature leaf loss'],management:['remove infected debris','reduce leaf wetness','open canopy','label-approved fungicide program when warranted']},
{id:'D003',name:'Cercospora leaf spot',type:'Fungal',risk:'Medium',symptoms:['small circular leaf spots','coalescing lesions','leaf drop'],management:['scout lower canopy','sanitation','balanced nutrition','targeted registered fungicide if justified']},
{id:'D004',name:'Anthracnose',type:'Fungal',risk:'Medium',symptoms:['sunken fruit lesions','necrotic leaf spots','twig lesions'],management:['careful harvest','remove mummified fruit','reduce humidity','registered fungicide program']},
{id:'D005',name:'Wilt complex',type:'Soil-borne',risk:'High',symptoms:['yellowing','drooping','vascular browning','progressive decline'],management:['confirm causal organism','improve drainage','avoid root injury','healthy nursery stock']},
{id:'D006',name:'Root rot',type:'Soil-borne',risk:'High',symptoms:['poor vigor','root decay','yellowing','collapse in wet soil'],management:['correct drainage','avoid standing water','inspect roots','pathogen-specific registered control']},
{id:'D007',name:'Fruit rot',type:'Fungal',risk:'Medium',symptoms:['softening','discoloration','decay after wounds'],management:['minimize fruit injury','remove infected fruit','clean harvest containers','approved post-harvest measures']},
{id:'D008',name:'Stem/collar canker',type:'Fungal/Bacterial',risk:'Medium',symptoms:['cankers','cracking','dieback','dark collar tissue'],management:['sanitize pruning','remove affected tissue','avoid collar wetness','confirm pathogen']},
{id:'D009',name:'Nutrient deficiency lookalikes',type:'Physiological',risk:'Medium',symptoms:['chlorosis','marginal scorch','poor growth','small/malformed fruit'],management:['soil/leaf testing','check pH and roots','correct confirmed deficiency gradually']}
];
export const pests=[
{id:'P001',name:'Fruit borer / anar butterfly',signs:'Larvae bore into fruit; frass and damaged arils may occur.',ipm:'Sanitation, infested-fruit removal, monitoring and physical protection where practical.'},
{id:'P002',name:'Thrips',signs:'Scarring, bronzing and distortion of tender growth or fruit surface.',ipm:'Scout flowers and flush; conserve beneficial insects; use selective registered control when warranted.'},
{id:'P003',name:'Aphids',signs:'Colonies on tender shoots with curling, honeydew and possible sooty mold.',ipm:'Encourage natural enemies; manage hotspots; avoid unnecessary broad-spectrum sprays.'},
{id:'P004',name:'Mealybugs',signs:'Cottony colonies, honeydew and weak shoot growth.',ipm:'Manage ants, prune hotspots and use biological/registered options.'},
{id:'P005',name:'Whiteflies',signs:'Adults fly from disturbed foliage; nymphs and honeydew occur underneath leaves.',ipm:'Monitor leaf undersides and preserve natural enemies.'},
{id:'P006',name:'Mites',signs:'Fine stippling, bronzing and sometimes webbing under hot/dry conditions.',ipm:'Monitor regularly, reduce plant stress and use registered miticides only when thresholds justify.'}
];
export const dashboard={orchardHealth:87,alerts:3,estimatedYield:'7.8 t',sales:'₹3.42L',margin:'₹1.86L',trees:1820,area:'8.5 acres',soilMoisture:68};
