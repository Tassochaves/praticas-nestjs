import { Controller, Post, HttpCode, Body, ConflictException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { hash } from "bcryptjs";

@Controller('/accounts')
export class CreateAccountController{
    
    constructor(private prisma: PrismaService){}

    @Post()
    @HttpCode(201)
    async handle(@Body() body: any){
        
        const { name, email, password } = body;

        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email,
            }    
        })

        const hashedPassword = await hash(password, 8);

        if(userWithSameEmail){
            throw new ConflictException('User with same email address already exists.')
        }

        await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })
    }
}