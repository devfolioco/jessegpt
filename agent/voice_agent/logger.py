import logging


def get_logger(name: str = "jessegpt") -> logging.Logger:
    """Return a project configured logger.

    The default logger logs INFO and higher to stdout. 3rd-party
    libraries or binary builds can import and reuse the same logger to
    keep a consistent logging format.
    """
    logger = logging.getLogger(name)

    return logger
