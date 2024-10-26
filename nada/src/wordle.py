from nada_dsl import *

def check_match(value_1: SecretInteger, value_2: Integer) -> Boolean:
    return value_1 == value_2

def nada_main():
    size = 3
    party1 = Party(name="Party1")

    letter_1 = SecretInteger(Input(name="letter_1", party=party1))
    letter_2 = SecretInteger(Input(name="letter_2", party=party1))
    letter_3 = SecretInteger(Input(name="letter_3", party=party1))
    guess_letter_1 = SecretInteger(Input(name="guess_letter_1", party=party1))
    guess_letter_2 = SecretInteger(Input(name="guess_letter_2", party=party1))
    guess_letter_3 = SecretInteger(Input(name="guess_letter_3", party=party1))

    result = []
    result.append(check_match(letter_1, guess_letter_1).if_else(Integer(1), Integer(0)))
    result.append(check_match(letter_2, guess_letter_2).if_else(Integer(1), Integer(0)))
    result.append(check_match(letter_3, guess_letter_3).if_else(Integer(1), Integer(0)))

    outputs = [Output(result[i], "my_output_" + str(i), party1) for i in range(size)]

    return outputs
    # return [Output(number_of_correct, "my_output", party1)]