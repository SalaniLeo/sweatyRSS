class userClass {
	name = $state();
    logged = $state();

	constructor(data: string, logged: boolean) {
		this.name = data;
        this.logged = logged
	}

	setName(name: string) {
		this.name = name;
	}

	setLogged(logged: boolean) {
		this.logged = logged;
	}

	getLogged = () => {
		return this.logged;
	}
    
    getName = () => {
		return this.name;
	}

	reset() {
		this.name = '';
        this.logged = false;
	}
}

export const user = new userClass('', false);