import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly booksRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    const newBook = {
      ...createBookDto,
      id: uuidv4(),
    };

    const book = this.booksRepository.create(newBook);

    const result = this.booksRepository.save(book);

    return result;
  }

  findAll({
    pageNum = 1,
    pageSize = 10,
  }: {
    pageNum: number;
    pageSize: number;
  }) {
    const books = this.booksRepository
      .createQueryBuilder()
      .offset(pageNum)
      .limit(pageSize)
      .getMany();

    return books;
  }

  findOne(id: string) {
    const book = this.booksRepository.findOneBy({
      id,
    });

    if (!book) {
      throw new NotFoundException(`Book with ${id} not found`);
    }

    return book;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    console.log('🚀 ~ BooksService ~ update ~ updateBookDto:', updateBookDto);
    return `This action updates a #${id} book`;
  }

  remove(id: string) {
    this.booksRepository.delete(id);
    return id;
  }
}
