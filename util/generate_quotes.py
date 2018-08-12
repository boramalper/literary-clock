#!/usr/bin/env python3

import csv
import collections
import json


def main():
	times = collections.defaultdict(list)

	with open("data/litclock_annotated.csv", newline="") as csv_file:
		csv_reader = csv.reader(csv_file, delimiter="|", skipinitialspace=True, strict=True)

		# row:
		# HH:MM|HIGHLIGHT|QUOTE|WORK|AUTHOR
		for row in csv_reader:
			time, highlight, quote, work, author = row
			hours, minutes = int(time.split(":")[0]), int(time.split(":")[1])
			quote, work, author = quote.strip(), work.strip(), author.strip()

			# print("%02d:%02d %s (in %s): %s..." % (hours, minutes, author, work, quote[:20]))
			# break

			try:
				emphasised_quote = emph(highlight, quote)
			except IndexError:
				continue

			times[hours * 60 + minutes].append({
				"quote" : emphasised_quote,
				"work"  : work,
				"author": author
			})

	with open("pkg/data/tqmap.json.js", "w") as times_file:
		times_file.write("const tqMap = ")
		json.dump(times, times_file, indent=4)
		times_file.write(";\n\n")
		times_file.write("const times = Object.keys(tqMap).map((t) => +t).sort((a, b) => a - b);\n")


def emph(bit, whole, start_tag='<span class="time">', end_tag='</span>'):
	ss = whole.split(bit, 1)
	return ss[0] + start_tag + bit + end_tag + ss[1]


if __name__ == "__main__":
	main()