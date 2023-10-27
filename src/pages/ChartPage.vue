<script async setup>
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../store.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
	Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
	Filler
)

const { query } = useRoute()
const router = useRouter()

const loading = ref(true);
const error = ref(false);
const error_message = ref("Unknown error");
const chart_options = ref({
			elements: {
				labels: {
					display: true
				}
			},
			responsive: true,
			maintainAspectRatio: true,
			plugins: {
				title: {
					display: true,
					text: 'Sprint Burndown Chart',
					font: {
						size: 24
					}
				}
			},
			scales: {
				y: {
					display: true,
					min: 0,
					title: {
						display: true,
						text: 'Effort (min)',
						font: {
							size: 18
						}
					}
				},
			}
		})

onMounted( async () => {
	if(store.graph_data != []) {
	}
	else {
		loading.value = false;
		error.value = true;
		error_message.value = "You need to select a project and milestone before getting here."
	}
});

</script>

<template>
	<div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
		<router-link style="z-index: 10000" to="/stage/choose_project"><button class="fixed bottom-5 right-5 mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded">Restart</button></router-link>
		<div class="absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
		<div class="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10" style="min-width:75%;">
			<div class="mx-auto">
				<div class="content-left">
					<h6>
						<img src="https://toddr.org/assets/images/t-logo.png" class="h-10 inline" alt="Tailwind Play" />
						<span class="text-gray-900 text-lg font-semibold pl-4">Burndown Chart</span>
					</h6>
					<hr class="h-0.5 mx-auto my-4 bg-gray-700 border-0 rounded dark:bg-gray-700" />
				</div>
				
				<div class="divide-y divide-gray-300/50">
					<div class="text-base font-semibold leading-7 flex" v-if="!error">
						<Line
							id="mainChart"
							:options="chart_options"
							:data="{
								labels: store.graph_dates,
								datasets: [{ label: store.milestone.title, data: store.graph_data, borderColor: '#3b82f6', fill: true, backgroundColor: '#3b82f655' }],
							}"
						/>
					</div>
					<div class="text-base leading-7" v-if="error">
						<span class="text-red-500 font-semibold">An error occurred while rendering the burndown chart.</span>
						<p class="italic text-sm">{{ error_message }}</p>
						<router-link to="/"><button class="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded">Go back</button></router-link>
					</div>
				</div>
			</div>
		</div>
	</div>	
</template>

