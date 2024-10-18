from nada_dsl import *

def nada_main():
    party1 = Party(name="Party1")

    letter_1 = SecretInteger(Input(name="letter_1", party=party1))
    letter_2 = SecretInteger(Input(name="letter_2", party=party1))
    letter_3 = SecretInteger(Input(name="letter_3", party=party1))

    new_word = letter_1 + letter_2 + letter_3

    return [Output(new_word, "my_output", party1)]