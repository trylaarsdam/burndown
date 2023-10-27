<script setup>
import { defineComponent, onMounted } from 'vue'
import { store } from '../store.js'
import { v4 } from 'uuid'

</script>


<template>
	<div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
		<div class="absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
		<div class="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10" style="min-width:50%;">
			<div class="mx-auto max-w-md">
				<div class="content-left">
					<h6>
						<img src="https://toddr.org/assets/images/t-logo.png" class="h-10 inline" alt="Tailwind Play" />
						<span class="text-gray-900 text-lg font-semibold pl-4">Burndown Chart Generator</span>
					</h6>
					<hr class="h-0.5 mx-auto my-4 bg-gray-700 border-0 rounded dark:bg-gray-700" />
				</div>
				
				<div class="divide-y divide-gray-300/50">
					<div class="pt-0 text-base leading-7">
						
						<p class="text-gray-900">To get started, you need to login with GitLab</p>
						<p>
							<a class="font-semibold text-sky-500 hover:text-sky-600" :href="'https://gitlab.com/oauth/authorize?client_id=bee52279fd0a1a30db7bfae74dba880a0a4de72fb1e0f96d25339f62154f3925&redirect_uri=https://burndown.toddr.org/stage/auth_callback&response_type=code&state=init_login&scope=read_repository+read_api&code_challenge=' + store.code_challenge + '&code_challenge_method=S256'">Login with GitLab &rarr;</a>
						</p>
						<p class="mt-10 text-xs italic">All authentication with GitLab is done in-browser, and this service never has access to your GitLab password. The GitLab session token used to access your account is thrown away the instant you close this tab.</p>
						<p class="text-xs">Made with an irresponsible use of free time by Todd Rylaarsdam.</p>
					</div>
				</div>
			</div>
		</div>
	</div>	
</template>

