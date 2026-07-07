# Career profile interview

Use this to build or update `private/career-profile.yaml` through conversation.  
The result stays **encrypted** in git; the public resume stays unchanged.

## How to run it

Tell any agent:

> Interview me using `job-fit/interview-questions.md` and update `private/career-profile.yaml`.

Ensure git-crypt is unlocked locally before editing the profile file.

## Questions

### Work mode & location

1. Remote, hybrid, or onsite — what do you **strongly** prefer? Any hard nos?
2. Where are you based? Open to relocate? Max commute if hybrid?
3. Travel tolerance (% or trips/year)?
4. Time zones you can work in?

### Role & level

5. Target titles in 1–2 years? (IC vs management)
6. Company size preference — startup, mid, enterprise?
7. Domains you want **more** of? Domains you want to **leave**?
8. Contract / full-time / contract-to-hire?

### Compensation (optional)

9. Minimum base to entertain a move? Target? Equity importance?
10. Anything else (bonus, signing, 1099 vs W2)?

### Skills truth layer

11. Languages/stacks on the resume — anything **missing** or **understated**? (e.g. Java)
12. What are you **strongest** at but tired of? What do you want **next**?
13. Anything on the resume you’d rather not do again?

### Dealbreakers

14. What makes you **instantly pass** on a posting?
15. What’s negotiable if everything else is great?

### Motivation

16. What work energizes you lately? (e.g. HPDevBox, architecture, IoT)
17. What drains you?
18. Dream companies or sectors? Companies to avoid?

### Narrative (won’t go on public resume)

19. Why are you looking (or open) now?
20. Family, health, or schedule constraints agents should weigh?
21. Anything you want a hiring consultant lens to know that ATS/recruiters won’t see?

### Closing

22. Review `profile.template.yaml` — any section missing?
23. Set `last_updated` to today.

After the interview, write `private/career-profile.yaml` from answers. Do **not** copy sensitive content into public files or commit messages.
