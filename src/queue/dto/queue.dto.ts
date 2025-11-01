import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateQueueDto {
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsString()
  @IsNotEmpty()
  patientPhone: string;

  @IsOptional()
  @IsNumber()
  appointmentId?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateQueueDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}