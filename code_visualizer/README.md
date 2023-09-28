hide too deep dependence

toggle: show file, module boundaries?

don't deal with stuff within a function: assumed to be self-contained
deal with stuff between functions and classes and above

variables can be passed around, so are local
however, function calls are nonlocal?
actually functions can also be passed around...

each language has special features...need to tweak?
eg toggle: hide _some_function? (internal function)
eg python: decorator

some things only known at runtime?
eg function call: in a function, use method of argument
then, must know what argument (what class)

for private repo: upload file?

uml for functional programming
"Functional programmers have their own version of UML, it is called Category Theory."

TODO: add these features
toggle: show external imports or not


pyreverse -ASmy pytesseract -b  # -o png
pyreverse -Smy pytesseract -b
pyreverse -Smy pytesseract
pyreverse -ASmy pytesseract
