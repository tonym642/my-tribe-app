# Advisor Registry

## Purpose

This file defines all advisors available in the My Tribe system.

It acts as the official registry for advisor identities, roles, and file locations.

The goal is to let the system discover advisors dynamically instead of hardcoding them in multiple places.

---

# Core Advisors

## Seth
Role: Spiritual Advisor  
File: advisors/seth.md  
Type: pillar  
Domain: spirituality  

## Marcus
Role: Mindset Advisor
File: advisors/marcus.md
Type: pillar
Domain: mindset

## Emma
Role: Emotional Advisor  
File: advisors/emma.md  
Type: pillar  
Domain: emotions  

## Hannah
Role: Health Advisor  
File: advisors/hannah.md  
Type: pillar  
Domain: health  

## Rachel
Role: Relationships Advisor  
File: advisors/rachel.md  
Type: pillar  
Domain: relationships  

## Frank
Role: Financial Advisor  
File: advisors/frank.md  
Type: pillar  
Domain: finances  

---

# Special Advisors

## Guide
Role: Personal Guide  
File: advisors/guide.md  
Type: custom  
Domain: multi-domain  

The Guide is configured by the user during onboarding.

---

## BVM
Role: Best Version of Me  
File: advisors/bvm.md  
Type: identity  
Domain: self  

BVM represents the user's ideal self and is only activated through the Ask BVM interaction pill.

BVM does not appear in the main advisor row.

---

# Main Advisor Row

The main advisor row contains only:

- Seth
- Marcus
- Emma
- Hannah
- Rachel
- Frank
- Guide

BVM is excluded from the main advisor row.

---

# Usage Rules

The system should use this registry to:

- load advisor definitions
- populate advisor selection UIs
- determine which advisors belong in the main row
- distinguish pillar advisors from special advisors
- support future advisor expansion without hardcoding

---

# Future Expansion

New advisors may be added later by registering them here with:

- name
- role
- file path
- type
- domain

This file should remain the single source of truth for advisor availability.