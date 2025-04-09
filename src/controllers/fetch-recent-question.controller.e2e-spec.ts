import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing"
import { hash } from "bcryptjs";
import { title } from "process";
import request from "supertest"

describe('Fetch recent questions (E2E)', ()=>{
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService
  
  //Start application with isolated database
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService)

    await app.init();
  });

  test("[GET] /questions", async () => {

    const user = await prisma.user.create({
          data: {
            name: "TesteE2e",
            email: "testee2e@gmail.com",
            password: await hash('123456', 8),
          },
        });

    const accessToken = jwt.sign({sub: user.id})

    await prisma.question.createMany({
      data: [
        {
          title: "Questao 01",
          slug: "Questao-01",
          content: "Conteudo questao01",
          authorId: user.id,
        },
        {
          title: "Questao 02",
          slug: "Questao-02",
          content: "Conteudo questao02",
          authorId: user.id,
        },
        {
          title: "Questao 03",
          slug: "Questao-03",
          content: "Conteudo questao03",
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: "Questao 01" }),
        expect.objectContaining({ title: "Questao 02" }),
        expect.objectContaining({ title: "Questao 03" }),
      ],
    });
  });
})