const scenarios = [
  // == Landlord & Tenant ==
  {
    "title": "Landlord entered room without permission",
    "keywords": ["landlord", "owner", "room", "house", "apartment", "flat", "entered", "without", "permission", "notice", "key", "lock", "privacy", "trespassing", "barged", "unannounced"],
    "rights_text": "Your right to privacy is protected. A landlord entering your rented room without prior notice or your consent is considered criminal trespassing.",
    "law_reference": "IPC Section 441",
    "script": "Sir, under IPC Section 441, you are not allowed to enter my rented room without my consent or prior notice. Please respect my privacy."
  },
  {
    "title": "Landlord refuses to return security deposit",
    "keywords": ["landlord", "owner", "security", "deposit", "return", "refund", "refuses", "money"],
    "rights_text": "The landlord is obligated to return the security deposit after deducting for damages, usually within a period specified in the rental agreement. Unjustified withholding can be challenged.",
    "law_reference": "Based on the Rental Agreement & state laws",
    "script": "As per our rental agreement, you are required to return the security deposit. Please process the refund at the earliest."
  },

  // == Police Interaction ==
  {
    "title": "Police Officer not filing an FIR",
    "keywords": ["police", "officer", "fir", "complaint", "refuses", "not", "filing", "registering"],
    "rights_text": "A police officer is legally bound to register an FIR for a cognizable offense. Refusal can be reported to a senior officer (like the Superintendent of Police) or a magistrate.",
    "law_reference": "CrPC Section 154",
    "script": "Officer, it is my right to have an FIR registered under Section 154 of the CrPC. If you refuse, I will have to report this to your superior officer."
  },
  {
    "title": "Woman being arrested at night",
    "keywords": ["woman", "lady", "female", "arrested", "arrest", "night", "sundown", "sunset"],
    "rights_text": "Generally, a woman cannot be arrested after sunset and before sunrise, except in exceptional circumstances with a warrant from a magistrate.",
    "law_reference": "CrPC Section 46(4)",
    "script": "According to Section 46(4) of the CrPC, you cannot arrest a woman after sunset without a special warrant. Please follow the correct procedure."
  },

  // == Consumer Rights ==
  {
    "title": "Shopkeeper refuses to take back faulty item",
    "keywords": ["shopkeeper", "faulty", "item", "return", "refund", "defective", "product", "broken"],
    "rights_text": "You are entitled to a refund, replacement, or repair for a defective product under consumer protection laws.",
    "law_reference": "Consumer Protection Act, 2019",
    "script": "As per the Consumer Protection Act, I am entitled to a full refund for this defective item as it was sold to me in this condition."
  },
  {
    "title": "Shopkeeper charging more than MRP",
    "keywords": ["mrp", "price", "overcharging", "more", "sticker", "shopkeeper", "charging"],
    "rights_text": "It is illegal for a seller to charge a price higher than the Maximum Retail Price (MRP) mentioned on the product packaging.",
    "law_reference": "Consumer Goods (Mandatory Printing of Cost of Production and Maximum Retail Price) Act, 2014",
    "script": "Sir, it is illegal to charge more than the MRP. Please bill me for the correct amount mentioned on the product."
  },

  // == Traffic Rules ==
  {
    "title": "Traffic police asks for original documents",
    "keywords": ["traffic", "police", "documents", "original", "license", "rc", "show"],
    "rights_text": "You are not required to hand over your original documents. You can show them to the officer or show digital copies stored in DigiLocker or mParivahan.",
    "law_reference": "Motor Vehicles Act, 1988 (as amended)",
    "script": "Officer, I can show you the documents, or digital copies from DigiLocker, but I am not required to hand over the originals."
  },
  {
    "title": "Car or bike being towed",
    "keywords": ["car", "bike", "vehicle", "towed", "towing", "no parking"],
    "rights_text": "A vehicle can only be towed from a designated 'No Parking' zone. If towed, a receipt must be issued, and you have the right to know where your vehicle has been taken.",
    "law_reference": "Motor Vehicles Act, 1988",
    "script": "Could you please tell me on what grounds my vehicle is being towed and provide an official receipt and the location of the impound lot?"
  },

  // == Employment ==
  {
    "title": "Employer not paying salary",
    "keywords": ["employer", "company", "boss", "salary", "payment", "not paying", "delay", "wages"],
    "rights_text": "Timely payment of salary is a legal right. An employer's failure to pay salary on time is a violation of labour laws and your employment contract.",
    "law_reference": "Payment of Wages Act, 1936",
    "script": "As per my employment contract and the Payment of Wages Act, I am entitled to my salary on the agreed-upon date. Please clear my pending salary immediately."
  }
];

module.exports = scenarios;