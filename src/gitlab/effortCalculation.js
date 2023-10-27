const structure = {
	y: 3679200,
	w: 10080,
	d: 1440,
	h: 60,
	m: 1
}

async function issueEffort(issue_id, project_id, token) {
	// Get the data
	const result = await (await fetch(`https://gitlab.com/api/v4/projects/${project_id}/issues/${issue_id}/notes?access_token=${token}`)).json()
	// Create an object that will be returned
	var data = {
		dailyTotals: {},
		total: { minutes: 0, pretty: '' },
		weeklyTotals: {},
		estimate: 0
	}

	// get issue 
	const issueResult = await (await fetch(`https://gitlab.com/api/v4/projects/${project_id}/issues/${issue_id}?access_token=${token}`)).json()
	// console.log(issueResult)
	try {
		data.estimate = issueResult.time_stats.time_estimate / 60
	} catch (err) {
		console.error("ERR: No time estimate found for issue " + issueResult.title + ".")
	}

		// Proccess the acquired data
	// console.log(result)
	result.forEach(i => {
		const splitBody = {
			date: i.body.replace(/^.*(from|at|) ([\d-]+|).*$/, '$2') || i.created_at.match(/^[\d-]+/)?.[0],
			spentTime: i.body.replace(/^(added|deleted) ([\d dhm]+) .*/, '$2'),
			type: i.body.match(/^(added|deleted)/)?.[0]
		}

		// If a note is not about spent time, ignore it
		if (!splitBody.type) {
			return
		}

		const weekNum = getIsoWeekNumber(splitBody.date)

		// Create daily subobjects for current date
		if (!(splitBody.date in data.dailyTotals)) {
			data.dailyTotals[splitBody.date] = { minutes: 0, pretty: '0m' }
		}

		// Create weekly subobjects for current week
		if (!(weekNum in data.weeklyTotals)) {
			data.weeklyTotals[weekNum] = { ...getDatesFromISOWeek(weekNum, new Date(splitBody.date).getUTCFullYear()), minutes: 0, pretty: '0m' }
		}

		// Calculate spent time in minutes
		const timeMinutes = prettyToMinutes(splitBody.spentTime, structure)

		if (splitBody.type === 'added') {
			// Calculate the daily total spent time
			data.dailyTotals[splitBody.date].minutes += timeMinutes
			data.dailyTotals[splitBody.date].pretty = minutesToPretty(data.dailyTotals[splitBody.date].minutes, structure)

			// Calculate the weekly total spent time
			data.weeklyTotals[weekNum].minutes += timeMinutes
			data.weeklyTotals[weekNum].pretty = minutesToPretty(data.weeklyTotals[weekNum].minutes, structure)

			// Calculate the total spent time
			data.total.minutes += timeMinutes
		} else {
			// Calculate the daily total spent time
			data.dailyTotals[splitBody.date].minutes -= timeMinutes
			data.dailyTotals[splitBody.date].pretty = minutesToPretty(data.dailyTotals[splitBody.date].minutes, structure)

			// Calculate the weekly total spent time
			data.weeklyTotals[weekNum].minutes -= timeMinutes
			data.weeklyTotals[weekNum].pretty = minutesToPretty(data.weeklyTotals[weekNum].minutes, structure)

			// Calculate the total spent time
			data.total.minutes -= timeMinutes
		}
	})

	// Format the total spent time
	data.total.pretty = minutesToPretty(data.total.minutes, structure)

	// Output the data
	// console.log(data)
	return data
}


function prettyToMinutes(duration, structure) {
	return duration
		.split(' ')
		.reduce((o, c, i) => o + +c.substring(
			0,
			c.search(
				new RegExp(`[${Object.keys(structure).join('')}]`)
			)
		) * structure[c.substring(c.length - 1)], 0)
}

function minutesToPretty(minutes, structure) {
	let formatted = ''

	for (let key in structure) {
		const v = Math.floor(minutes / structure[key])

		if (v > 0) {
			const vKey = Math.floor(minutes / structure[key])
			formatted += `${formatted.length > 0 ? ' ' : ''}${vKey}${key}`
			minutes -= vKey * structure[key]
		}
	}

	return formatted
}

/**
 * For a given date, get the ISO week number
 *
 * @remarks This function was sourced from [StakOverflow](https://stackoverflow.com/a/6117889/3408342).
 *
 * @param    date - Date which should be considered
 * @returns  ISO week number of the specified date
 */
function getIsoWeekNumber(dateString) {
	const date = new Date(dateString)
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
	return Math.ceil(((d.getTime() - new Date(Date.UTC(d.getUTCFullYear(), 0, 1)).getTime()) / 864e5 + 1) / 7)
}

function getDatesFromISOWeek(week, year) {
	const simple = new Date(year, 0, 1 + (week - 1) * 7)
	const dow = simple.getUTCDay()
	const startDate = simple

	if (dow <= 4) {
		startDate.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1)
	} else {
		startDate.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay())
	}

	const endDate = new Date(startDate)
	endDate.setUTCDate(endDate.getUTCDate() + 7)

	return {
		endDate: `${endDate.getUTCFullYear()}-${(endDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${endDate.getUTCDate().toString().padStart(2, '0')}`,
		startDate: `${startDate.getUTCFullYear()}-${(startDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${startDate.getUTCDate().toString().padStart(2, '0')}`
	}
}

export {issueEffort};