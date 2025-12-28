export const CHUNKING_SAMPLES = {
    legal: {
        title: "Terms of Service (Legal)",
        content: `
1. ACCEPTANCE OF TERMS
By accessing and using this Service, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.

2. PROVISION OF SERVICES
You agree and acknowledge that the entitlement to use the Service is at the sole discretion of the Site Operator. The Site Operator is entitled to modify, improve or discontinue any of its services at its sole discretion and without notice to you even if it may result in you being prevented from accessing any information contained in it.

3. PROPRIETARY RIGHTS
You acknowledge and agree that the Site contains proprietary and confidential information that is protected by applicable intellectual property and other laws. You further acknowledge and agree that Content contained in sponsor advertisements or information presented to you through the Site or advertisers is protected by copyrights, trademarks, service marks, patents or other proprietary rights and laws.

4. DISCLAIMER OF WARRANTIES
You expressly understand and agree that your use of the site is at your sole risk and that the site is provided on an "as is" and "as available" basis.
        `
    },
    code: {
        title: "Python Transformation (Code)",
        content: `
def calculate_fibonacci(n):
    """
    Calculates the nth Fibonacci number recursively.
    """
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

class DataProcessor:
    def __init__(self, data_source):
        self.source = data_source
        self.cache = {}

    def process(self):
        # Load data
        raw_data = self.source.read()
        
        # Transform
        transformed = [x.strip().lower() for x in raw_data if x]
        
        # Cache results
        for item in transformed:
            if item not in self.cache:
                self.cache[item] = 0
            self.cache[item] += 1
            
        return self.cache
        `
    },
    article: {
        title: "Mars Rover Discovery (Article)",
        content: `
NASA's latest Mars rover, Perseverance, has made a groundbreaking discovery in the Jezero Crater. While analyzing rock samples drilled from an ancient river delta, the rover detected organic molecules—the building blocks of life as we know it.

"This is not proof of life," cautioned Dr. Elena Rodriguez, the mission's lead astrobiologist. "However, it is the most promising biosignature we have ever found on the Red Planet."

The sample, nicknamed "Wildcat Ridge," contains a high concentration of organic matter. The molecules appear to be aromatics, stable rings of carbon and hydrogen that can persist for billions of years. To confirm if they are biological in origin, the samples must be returned to Earth.

The Mars Sample Return mission, a collaboration between NASA and ESA, aims to retrieve these tubes in the early 2030s. Until then, Perseverance will continue its ascent up the crater rim, exploring older and more diverse geological formations.
        `
    }
};
