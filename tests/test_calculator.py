"""Unit tests for the calculator module.

Run with either:
    python -m unittest discover -s tests
    pytest
"""

import unittest

from calculator import (
    add,
    divide,
    factorial,
    fibonacci,
    fizzbuzz,
    is_palindrome,
    is_prime,
    multiply,
    reverse_string,
    subtract,
)


class TestAdd(unittest.TestCase):
    def test_positive_numbers(self):
        self.assertEqual(add(2, 3), 5)

    def test_negative_numbers(self):
        self.assertEqual(add(-1, -1), -2)

    def test_mixed_signs(self):
        self.assertEqual(add(-3, 7), 4)

    def test_zeros(self):
        self.assertEqual(add(0, 0), 0)

    def test_floats(self):
        self.assertAlmostEqual(add(0.1, 0.2), 0.3)

    def test_identity(self):
        self.assertEqual(add(42, 0), 42)


class TestSubtract(unittest.TestCase):
    def test_basic(self):
        self.assertEqual(subtract(10, 4), 6)

    def test_negative_result(self):
        self.assertEqual(subtract(4, 10), -6)

    def test_self_subtraction(self):
        self.assertEqual(subtract(7, 7), 0)

    def test_floats(self):
        self.assertAlmostEqual(subtract(2.5, 1.25), 1.25)


class TestMultiply(unittest.TestCase):
    def test_positive_numbers(self):
        self.assertEqual(multiply(3, 4), 12)

    def test_by_zero(self):
        self.assertEqual(multiply(99, 0), 0)

    def test_negative_numbers(self):
        self.assertEqual(multiply(-2, -3), 6)

    def test_mixed_signs(self):
        self.assertEqual(multiply(-2, 5), -10)

    def test_floats(self):
        self.assertAlmostEqual(multiply(1.5, 2.0), 3.0)


class TestDivide(unittest.TestCase):
    def test_exact_division(self):
        self.assertEqual(divide(10, 2), 5)

    def test_fractional_result(self):
        self.assertAlmostEqual(divide(1, 3), 0.3333333333)

    def test_negative_dividend(self):
        self.assertEqual(divide(-9, 3), -3)

    def test_divide_by_zero_raises(self):
        with self.assertRaises(ZeroDivisionError):
            divide(1, 0)

    def test_zero_numerator(self):
        self.assertEqual(divide(0, 5), 0)


class TestFactorial(unittest.TestCase):
    def test_zero(self):
        self.assertEqual(factorial(0), 1)

    def test_one(self):
        self.assertEqual(factorial(1), 1)

    def test_small_values(self):
        self.assertEqual(factorial(5), 120)
        self.assertEqual(factorial(6), 720)

    def test_larger_value(self):
        self.assertEqual(factorial(10), 3628800)

    def test_negative_raises(self):
        with self.assertRaises(ValueError):
            factorial(-1)

    def test_non_integer_raises(self):
        with self.assertRaises(TypeError):
            factorial(3.5)

    def test_bool_raises(self):
        with self.assertRaises(TypeError):
            factorial(True)


class TestIsPrime(unittest.TestCase):
    def test_primes(self):
        for n in (2, 3, 5, 7, 11, 13, 97, 7919):
            with self.subTest(n=n):
                self.assertTrue(is_prime(n))

    def test_non_primes(self):
        for n in (0, 1, 4, 6, 8, 9, 100, 7917):
            with self.subTest(n=n):
                self.assertFalse(is_prime(n))

    def test_negative_numbers(self):
        self.assertFalse(is_prime(-7))

    def test_two_is_smallest_prime(self):
        self.assertTrue(is_prime(2))

    def test_non_integer_raises(self):
        with self.assertRaises(TypeError):
            is_prime(2.0)


class TestFizzBuzz(unittest.TestCase):
    def test_fizz(self):
        self.assertEqual(fizzbuzz(3), "Fizz")
        self.assertEqual(fizzbuzz(9), "Fizz")

    def test_buzz(self):
        self.assertEqual(fizzbuzz(5), "Buzz")
        self.assertEqual(fizzbuzz(10), "Buzz")

    def test_fizzbuzz(self):
        self.assertEqual(fizzbuzz(15), "FizzBuzz")
        self.assertEqual(fizzbuzz(30), "FizzBuzz")

    def test_plain_number(self):
        self.assertEqual(fizzbuzz(1), "1")
        self.assertEqual(fizzbuzz(7), "7")


class TestReverseString(unittest.TestCase):
    def test_normal_string(self):
        self.assertEqual(reverse_string("hello"), "olleh")

    def test_empty_string(self):
        self.assertEqual(reverse_string(""), "")

    def test_palindrome(self):
        self.assertEqual(reverse_string("racecar"), "racecar")

    def test_single_character(self):
        self.assertEqual(reverse_string("a"), "a")

    def test_non_string_raises(self):
        with self.assertRaises(TypeError):
            reverse_string(123)


class TestIsPalindrome(unittest.TestCase):
    def test_simple_palindrome(self):
        self.assertTrue(is_palindrome("madam"))

    def test_case_insensitive(self):
        self.assertTrue(is_palindrome("RaceCar"))

    def test_ignores_punctuation_and_spaces(self):
        self.assertTrue(is_palindrome("A man, a plan, a canal: Panama"))

    def test_not_a_palindrome(self):
        self.assertFalse(is_palindrome("hello"))

    def test_empty_string(self):
        self.assertTrue(is_palindrome(""))


class TestFibonacci(unittest.TestCase):
    def test_zero_terms(self):
        self.assertEqual(fibonacci(0), [])

    def test_one_term(self):
        self.assertEqual(fibonacci(1), [0])

    def test_first_sequence(self):
        self.assertEqual(fibonacci(10), [0, 1, 1, 2, 3, 5, 8, 13, 21, 34])

    def test_length_matches_input(self):
        self.assertEqual(len(fibonacci(15)), 15)

    def test_negative_raises(self):
        with self.assertRaises(ValueError):
            fibonacci(-1)

    def test_non_integer_raises(self):
        with self.assertRaises(TypeError):
            fibonacci("ten")


if __name__ == "__main__":
    unittest.main()
