export class Resident {

    constructor(
        public id: number = undefined,
        public first_name: string = '',
        public last_name: string = '',
        public is_a: string = '',
        public remarks: string = '',
        public owner_id: number = undefined
    ) { }

    clone() {
        return new Resident(
            this.id,
            this.first_name,
            this.last_name,
            this.is_a,
            this.remarks,
            this.owner_id
        );
    }

}