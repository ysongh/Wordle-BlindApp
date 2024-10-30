from nada_dsl import *

SIZE = 3

def check_match(value_1: SecretInteger, value_2: Integer) -> Boolean:
    return value_1 == value_2

def is_number_present_in_list(array: List[SecretInteger], value: SecretInteger) -> Integer:
    is_found = Integer(0)
    for i in range(SIZE):
        is_found += (value == array[i]).if_else(Integer(1), Integer(0))

    return is_found

def nada_main():
    party1 = Party(name="Party1")

    letter_1 = SecretInteger(Input(name="letter_1", party=party1))
    letter_2 = SecretInteger(Input(name="letter_2", party=party1))
    letter_3 = SecretInteger(Input(name="letter_3", party=party1))
    guess_letter_1 = SecretInteger(Input(name="guess_letter_1", party=party1))
    guess_letter_2 = SecretInteger(Input(name="guess_letter_2", party=party1))
    guess_letter_3 = SecretInteger(Input(name="guess_letter_3", party=party1))

    word: list[SecretInteger] = [
        letter_1,
        letter_2,
        letter_3
    ]

    result = []
    result.append((check_match(letter_1, guess_letter_1)).if_else(Integer(9), is_number_present_in_list(word, guess_letter_1)))
    result.append((check_match(letter_2, guess_letter_2)).if_else(Integer(9), is_number_present_in_list(word, guess_letter_2)))
    result.append((check_match(letter_3, guess_letter_3)).if_else(Integer(9), is_number_present_in_list(word, guess_letter_3)))

    outputs = [Output(result[i], str(i + 1), party1) for i in range(SIZE)]

    return outputs