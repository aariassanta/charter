#!/usr/bin/env python3
"""Test agno import isolation step by step."""
import sys, os

print(f"CWD: {os.getcwd()}")
print(f"sys.path[0]: {repr(sys.path[0])}")
print()

# 1. Import agno directly
import agno
print(f"1. agno OK: {agno.__file__}")
print(f"   sys.modules['agno']: {sys.modules['agno'].__file__}")
print()

# 2. Import agents package
import agents
print(f"2. agents OK: {agents.__file__}")
print()

# 3. Now try to get extractor_agent's code and exec it with a custom globals
import types

# Create a proper namespace for the module
mod_globals = {
    "__name__": "agents.extractor_agent",
    "__file__": "/Users/Alfredo/charter-worker/agents/extractor_agent.py",
    "__package__": "agents",
    "__spec__": None,
    # Pre-populate with known good modules
    "sys": sys,
    "json": __import__("json"),
    "re": __import__("re"),
    "Any": __import__("typing").Any,
}

# Add agno explicitly to the module's namespace
import agno as agno_module
mod_globals["agno"] = agno_module
mod_globals["Agent"] = agno.Agent
mod_globals["Model"] = agno.Model

print("3. Pre-populated mod_globals with agno")
print(f"   'agno' in mod_globals: {'agno' in mod_globals}")
print()

# 4. Now exec the file
code = open("/Users/Alfredo/charter-worker/agents/extractor_agent.py").read()
try:
    exec(code, mod_globals)
    print("4. exec OK!")
    print(f"   build_extractor_agent in mod_globals: {'build_extractor_agent' in mod_globals}")
except ImportError as e:
    print(f"4. exec FAILED: {e}")
