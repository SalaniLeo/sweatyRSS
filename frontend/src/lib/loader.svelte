<script lang="ts">
</script>

<div class="content hexpand vexpand">
	<div class="loader flexrow gap2">
		<div class="dot"></div>
		<div class="dot"></div>
		<div class="dot"></div>
	</div>
</div>

<style>
	@keyframes loader {
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
		100% {
			transform: translateY(0);
		}
	}
	.dot:nth-child(1) {
		animation: loader 1s infinite 0s;
	}
	.dot:nth-child(2) {
		animation: loader 1s infinite 0.2s;
	}
	.dot:nth-child(3) {
		animation: loader 1s infinite 0.4s;
	}
	.dot {
		border-radius: 50%;
		width: 0.75rem;
		height: 0.75rem;
		background-color: var(--font-primary-color);
	}
	.content {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
