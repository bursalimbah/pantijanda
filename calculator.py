"""A small reference module with pure functions, used to demonstrate unit tests."""


def add(a: float, b: float) -> float:
    """Return the sum of a and b."""
    return a + b


def subtract(a: float, b: float) -> float:
    """Return the difference a - b."""
    return a - b


def multiply(a: float, b: float) -> float:
    """Return the product of a and b."""
    return a * b


def divide(a: float, b: float) -> float:
    """Return the quotient a / b.

    Raises:
        ZeroDivisionError: if b is zero.
    """
    if b == 0:
        raise ZeroDivisionError("division by zero")
    return a / b


def factorial(n: int) -> int:
    """Return n! for a non-negative integer n.

    Raises:
        ValueError: if n is negative.
        TypeError: if n is not an integer.
    """
    if not isinstance(n, int) or isinstance(n, bool):
        raise TypeError("n must be an integer")
    if n < 0:
        raise ValueError("n must be non-negative")
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result


def is_prime(n: int) -> bool:
    """Return True if n is a prime number, False otherwise."""
    if not isinstance(n, int) or isinstance(n, bool):
        raise TypeError("n must be an integer")
    if n < 2:
        return False
    if n < 4:
        return True
    if n % 2 == 0:
        return False
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True


def fizzbuzz(n: int) -> str:
    """Return the FizzBuzz string for a positive integer n."""
    if n % 15 == 0:
        return "FizzBuzz"
    if n % 3 == 0:
        return "Fizz"
    if n % 5 == 0:
        return "Buzz"
    return str(n)


def reverse_string(s: str) -> str:
    """Return the reversed string."""
    if not isinstance(s, str):
        raise TypeError("s must be a string")
    return s[::-1]


def is_palindrome(s: str) -> bool:
    """Return True if s reads the same forwards and backwards (case-insensitive)."""
    cleaned = "".join(ch.lower() for ch in s if ch.isalnum())
    return cleaned == cleaned[::-1]


def fibonacci(n: int) -> list:
    """Return a list with the first n Fibonacci numbers (F0 = 0, F1 = 1)."""
    if not isinstance(n, int) or isinstance(n, bool):
        raise TypeError("n must be an integer")
    if n < 0:
        raise ValueError("n must be non-negative")
    seq = []
    a, b = 0, 1
    for _ in range(n):
        seq.append(a)
        a, b = b, a + b
    return seq
