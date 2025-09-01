import { ApiProperty } from '@nestjs/swagger'
import { TaskType } from '@/common/enums/task-type.enum'

export class LoginOtpChallengeResponseDto {
  @ApiProperty({
    description: 'Mensagem informativa sobre o OTP',
    example: 'Código OTP enviado para seu email',
    type: String,
  })
  message: string

  @ApiProperty({
    description: 'Tipo de tarefa pendente',
    example: TaskType.OTP_CHALLENGER,
    enum: TaskType,
    enumName: 'TaskType',
  })
  taskType: TaskType
}
