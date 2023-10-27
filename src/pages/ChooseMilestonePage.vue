<script async setup>
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../store.js'
const { query } = useRoute()
const router = useRouter()

const loading = ref(true);
const error = ref(false);
const error_message = ref("Unknown error");

const milestones = ref([]);
const selected_milestone = ref({});

const selectMilestone = () => {
	if (selected_milestone.value != "") {
		store.milestone_id = selected_milestone.value.id;
		store.milestone = selected_milestone.value;
		router.push("/stage/load_issues")
	}
	else {
		window.alert("You need to choose a project before continuing");
	}
	
}

onMounted( async () => {
	if (store.access_token != '' && store.access_token != null && store.access_token != undefined) {
		if (store.project_id == '' || store.project_id == null || store.project_id == undefined) {
			loading.value = false;
			error.value = true;
			error_message.value = "You need to choose a project before getting here."
		}
		else {
			var response = await fetch("https://gitlab.com/api/v4/projects/" + store.project_id + "/milestones?per_page=100", {
				method: "GET",
				headers: {
					"Authorization": "Bearer " + store.access_token
				}
			})

			if (response.status == 200) {
				var json = await response.json();
				milestones.value = json;
				loading.value = false;
			}
			else {
				var json = await response.json();
				console.log(json);
				loading.value = false;
				error.value = true;
				error_message.value = json.error_description
			}
		}
	}
	else {
		error.value = true;
		error_message.value = "You need to be authenticated with GitLab before getting here."
	}
});

</script>

<template>
	<div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12 ">
		<div class="absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
		<div class="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10 " style="min-width:50%;">
			<div class="mx-auto max-w-md">
				<div class="content-left">
					<h6>
						<img src="https://toddr.org/assets/images/t-logo.png" class="h-10 inline" alt="Tailwind Play" />
						<span class="text-gray-900 text-lg font-semibold pl-4">Choose a Milestone</span>
					</h6>
					<hr class="h-0.5 mx-auto my-4 bg-gray-700 border-0 rounded dark:bg-gray-700" />
				</div>
				
				<div class="divide-y divide-gray-300/50">
					<div class="text-base font-semibold leading-7 flex" v-if="loading">
						<svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
						</svg>
						<span class="text-gray-900">Loading Milestones...</span>
					</div>
					<div v-if="!loading && !error">
						<div class="text-base font-semibold leading-7 flex">
							<label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
								<select v-model="selected_milestone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
									<option disabled :value="{}">Choose a milestone</option>
									<option v-for="option in milestones" :value="option" :key="option.id.toString()">{{option.title}}</option>
								</select>
						</div>
						<button :disabled="selected_milestone == {}" @click="selectMilestone" class="mt-4 bg-green-500 text-white disabled:bg-gray-500 font-semibold py-2 px-4 rounded">Continue</button>
					</div>
					<div class="text-base leading-7" v-if="error">
						<span class="text-red-500 font-semibold">An error occurred while fetching the milestones for this project.</span>
						<p class="italic text-sm">{{ error_message }}</p>
						<router-link to="/"><button class="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded">Go back</button></router-link>
					</div>
				</div>
			</div>
		</div>
	</div>	
</template>

