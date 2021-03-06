import { FilesRepository } from '@app/files/database/repositories/files.repository';
import { CreateFileDTO } from '@app/files/dto/create-file.dto';
import { FileDTO } from '@app/files/dto/file.dto';
import { ReadFilePaymentProofDTO } from '@app/files/dto/read-file-payment-proof.dto';
import { IFilesService } from '@app/files/services/interfaces/files-service.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@shared/enums/role.enum';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FilesService implements IFilesService {
  constructor(
    @InjectRepository(FilesRepository)
    private readonly filesRepository: FilesRepository,
  ) {}
  async createFile(payload: CreateFileDTO): Promise<FileDTO> {
    const fileDTO = plainToInstance(FileDTO, payload);
    const savedFileDTO = await this.filesRepository.saveFile(fileDTO);
    return savedFileDTO;
  }

  async readFilePaymentProof(
    payload: ReadFilePaymentProofDTO,
  ): Promise<FileDTO> {
    const fileDTO = plainToInstance(FileDTO, {
      id: payload.id,
      userId: payload.userId,
    } as Partial<FileDTO>);
    let foundFileDTO: FileDTO;
    if (payload.userRoles.includes(Role.Admin)) {
      foundFileDTO = await this.filesRepository.findFile(fileDTO);
    } else {
      foundFileDTO = await this.filesRepository.findFileWithUserId(fileDTO);
    }
    foundFileDTO.validatePathFile('payment-proof');
    return foundFileDTO;
  }
}
