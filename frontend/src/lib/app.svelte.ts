class appClass {
	message: string = $state('')
    code: number = $state(200)
    show: boolean = $state(false)

	setStatus(message: string, code: number) {
        this.show = true
        this.message = message;
        this.code = code
	}

    doShow = () => {
        return this.show
    }

    getCode = () => {
        return this.code
    }

	getMessage = () => {
		return this.message;
	}

    getStatus = () => {
        return {
            code: this.code,
            message: this.message
        }
    }

    hideToast() {
        this.show = false
    }

	reset() {
		this.message = '';
        this.code = 200;
        this.hideToast()
	}
}

export const app = new appClass();