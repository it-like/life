import json
import os 
def parse_flashcards(file_path):
    cards = []
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            if line.startswith('#'):  # Skip lines that are comments
                continue
            parts = line.split('\t')  # Split each line on the tab separator
            if len(parts) >= 3:
                card = {
                    'category':"Mathematics::Nonlinear Optimization:: Theorems and Proofs",
                    'term': parts[0].strip(),  # Changed from 'prompt'
                    'definition': parts[1].strip(),  # Changed from 'content'
                    'tags': parts[2].strip()
                }
                cards.append(card)
    
    return cards

def save_to_json(cards, output_file):
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(cards, file, ensure_ascii=False, indent=4)

def convert_txt_to_json(input_file, output_file):
    flashcards = parse_flashcards(input_file)
    save_to_json(flashcards, output_file)

#for filename in os.scandir('flashcards/decks/TXTFiles'):
#    if filename.is_file():
#        input_file = filename.path
#        print(input_file)
#        output_file = 'flashcards/decks/JSONFiles/' + filename.name.split('.')[0] + '.json'
#        print(output_file)
#        convert_txt_to_json(input_file, output_file)

input_file = 'flashcards/decks/TXTFiles/NonLinearOpt.txt'
output_file = 'flashcards/decks/JSONFiles/NonLinearOpt.json'
convert_txt_to_json(input_file, output_file)
