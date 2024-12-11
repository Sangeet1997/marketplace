import csv

def generate_sentences_from_csv(file_path):
    sentences = []

    with open(file_path, 'r') as file:
        reader = csv.DictReader(file)

        for row in reader:
            sentence = (
                f"The car with ID {row['car_ID']} and symboling rating of {row['symboling']}, named {row['CarName']}, runs on {row['fueltype']}, "
                f"has {row['aspiration']} aspiration, a {row['doornumber']}-door {row['carbody']}, and features {row['drivewheel']} drive with {row['enginelocation']} engine location. "
                f"It offers a wheelbase of {row['wheelbase']} inches, car length of {row['carlength']} inches, car width of {row['carwidth']} inches, and car height of {row['carheight']} inches, "
                f"weighing {row['curbweight']} lbs. Powered by a {row['enginetype']} engine with {row['cylindernumber']} cylinders and {row['enginesize']} cc, "
                f"it uses a {row['fuelsystem']} fuel system, with a bore ratio of {row['boreratio']}, stroke of {row['stroke']}, and compression ratio of {row['compressionratio']}, "
                f"delivering {row['horsepower']} hp at {row['peakrpm']} rpm, achieving {row['citympg']} mpg in the city and {row['highwaympg']} mpg on highways, priced at {row['price']} dollars."
            )
            sentences.append(sentence)

    return sentences
def save_sentences_to_file(sentences, output_file):
    with open(output_file, 'w') as file:
        for sentence in sentences:
            file.write(sentence + "\n\n")


file_path = './csvfiles/OGCarPrice.csv' 
output_path = './Documents/prices.txt' 

sentences = generate_sentences_from_csv(file_path)

save_sentences_to_file(sentences, output_path)

print(f"Sentences have been saved to {output_path}")
