package com.example.orchid.exceptions;

import java.time.Instant;

public record ApiError(Instant timestamp, int status, String message, String path) {}
