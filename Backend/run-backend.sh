#!/usr/bin/env bash
set -euo pipefail

# Run backend without Maven using prebuilt classes + local Maven cache jars.
# If you changed Java code, recompile first (requires Maven) or use your IDE build.
CP="target/classes:$(find "$HOME/.m2/repository" -name '*.jar' | tr '\n' ':')"
exec java -cp "$CP" ragstoriches.Main
