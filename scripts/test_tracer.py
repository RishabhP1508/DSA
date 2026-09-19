import sys, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "src", "engine"))
import tracer

src = '''nums = [3, 1, 2]
total = 0
for x in nums:
    total = total + x
print(total)
'''

res = tracer.run_program(src, "<lesson>", 10000, 16*1024*1024, "")
print("STATUS:", res["status"])
print("STDOUT:", repr(res["stdout"]))
print("NUM EVENTS:", len(res["events"]))
for e in res["events"][:6]:
    frames = e["frames"]
    top = frames[-1] if frames else {}
    locs = {l["name"]: l["value"] for l in top.get("locals", [])}
    print(f"  #{e['index']} {e['kind']} line={e['line']} locals={list(locs.keys())}")

src2 = '''a = [1, 2]
b = a
a.append(b)
'''
res2 = tracer.run_program(src2, "<lesson>", 10000, 16*1024*1024, "")
print("CYCLE STATUS:", res2["status"], "objects:", len(res2["events"][-1]["objects"]))

src3 = '''x = 1
y = x / 0
'''
res3 = tracer.run_program(src3, "<lesson>", 10000, 16*1024*1024, "")
print("ERR STATUS:", res3["status"], "ERR:", res3.get("error"))

src4 = '''name = input("Name? ")
print("Hi", name)
'''
res4 = tracer.run_program(src4, "<lesson>", 10000, 16*1024*1024, "Ada\n")
print("INPUT STDOUT:", repr(res4["stdout"]))

json.dumps(res["events"])
print("JSON OK")
