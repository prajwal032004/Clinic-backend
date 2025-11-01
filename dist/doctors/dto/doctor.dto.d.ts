export declare class CreateDoctorDto {
    name: string;
    specialization: string;
    gender: string;
    location: string;
    availability?: string;
}
export declare class UpdateDoctorDto {
    name?: string;
    specialization?: string;
    gender?: string;
    location?: string;
    availability?: string;
    isActive?: boolean;
}
