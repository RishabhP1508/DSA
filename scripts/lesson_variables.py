# A name is a label that refers to a value (an object).
score = 42
# Reassigning changes which object the name refers to; the type follows.
score = 42.5
# Strings hold text.
player = "Ada"
# Booleans are True or False.
is_ready = True
# None represents "no value yet".
result = None
# Two names can refer to the same list object (aliasing).
scores = [10, 20, 30]
best = scores
# Mutating through one name is visible through the other.
best.append(40)
# Show the types and values we built.
print(player, score, is_ready, result)
print(scores)
