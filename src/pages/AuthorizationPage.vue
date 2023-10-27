<script async setup>
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../store.js'
const { query } = useRoute()

const loading = ref(true);
const error = ref(false);
const error_message = ref("Unknown error");

onMounted( async () => {
	if (query.state == "init_login") {
		if (query.code == undefined) {
			loading.value = true;
			error.value = true;
			error_message.value = "Auth callback code was not provided"
		}
		else if (store.code_verifier == undefined || store.code_verifier == "" || store.code_verifier == null) {
			loading.value = false;
			error.value = true;
			error_message.value = "Missing PKCE code verifier in internal state. Go back and try again."
		}
		else {
			var response = await fetch("https://gitlab.com/oauth/token?" + new URLSearchParams({
				client_id: "bee52279fd0a1a30db7bfae74dba880a0a4de72fb1e0f96d25339f62154f3925",
				code: query.code,
				grant_type: "authorization_code",
				redirect_uri: "http://localhost:5173/stage/auth_callback",
				code_verifier: store.code_verifier,
			}), {
				method: "POST",
			});
			
			if(response.status == 200) {
				var json = await response.json();
				console.log(json);
			}
			else {
				loading.value = false;
				error.value = true;
				error_message.value = "Auth callback code was rejected"
			}
		}
	}
	else {
		loading.value = false;
		error.value = true;
		error_message.value = "Auth callback state was invalid"
	}
});

</script>

<template>
	<div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
		<div class="absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
		<div class="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
			<div class="mx-auto max-w-md">
				<div class="content-left">
					<h6>
						<img src="https://toddr.org/assets/images/t-logo.png" class="h-10 inline" alt="Tailwind Play" />
						<span class="text-gray-900 text-lg font-semibold pl-4">CSIS 321 Burndown Generator</span>
					</h6>
					<hr class="h-0.5 mx-auto my-4 bg-gray-700 border-0 rounded dark:bg-gray-700" />
				</div>
				
				<div class="divide-y divide-gray-300/50">
					<div class="text-base font-semibold leading-7 flex" v-if="loading">
						<svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
						</svg>
						<span class="text-gray-900">Authorizing...</span>
					</div>
					<div class="text-base leading-7" v-if="error">
						<span class="text-red-500 font-semibold">An error occurred while authenticating with GitLab.</span>
						<p class="italic text-sm">{{ error_message }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>	
</template>

