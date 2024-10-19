from nada_dsl import *

def check_match(value_1: SecretInteger, value_2: Integer) -> Boolean:
    return value_1 == value_2

def nada_main():
    party1 = Party(name="Party1")

    letter_1 = SecretInteger(Input(name="letter_1", party=party1))
    letter_2 = SecretInteger(Input(name="letter_2", party=party1))
    letter_3 = SecretInteger(Input(name="letter_3", party=party1))
    guess_letter_1 = SecretInteger(Input(name="guess_letter_1", party=party1))
    guess_letter_2 = SecretInteger(Input(name="guess_letter_2", party=party1))
    guess_letter_3 = SecretInteger(Input(name="guess_letter_3", party=party1))

    number_of_correct = Integer(0)
    number_of_correct += check_match(letter_1, guess_letter_1).if_else(Integer(1), Integer(0))
    number_of_correct += check_match(letter_2, guess_letter_2).if_else(Integer(1), Integer(0))
    number_of_correct += check_match(letter_3, guess_letter_3).if_else(Integer(1), Integer(0))

    return [Output(number_of_correct, "my_output", party1)]