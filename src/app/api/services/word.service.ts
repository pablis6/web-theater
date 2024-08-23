import { DatePipe, UpperCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Representacion } from '@api/types/representacion';
import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun,
  UnderlineType,
} from 'docx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  constructor(
    private readonly datePipe: DatePipe,
    private readonly upperCasePipe: UpperCasePipe
  ) {}

  generateDocument(representacion: Representacion, personas: any[]) {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: this.upperCasePipe.transform(
                    'Entradas ' +
                      representacion?.obra?.name +
                      ' ' +
                      this.datePipe.transform(
                        representacion?.fecha,
                        "EEEE dd 'de' MMMM"
                      )
                  ),
                  underline: { type: UnderlineType.SINGLE },
                  bold: true,
                  font: 'Arial',
                  size: 16 * 2, // Tamaño en puntos, multiplicado por 2
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({}),
            ...this.getEntradasParagraph(personas),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(
        blob,
        representacion?.obra?.name +
          '_' +
          representacion?.fecha +
          '_' +
          representacion?.sesion +
          '.docx'
      );
    });
  }

  getEntradasParagraph(personas: any[]): Paragraph[] {
    let entradas = '';
    let recuentoEntradas = 0;
    let lastPerson = '';
    let entradasParagraph: Paragraph[] = [];

    personas.forEach((persona) => {
      if (lastPerson !== persona.asignadoA) {
        if (entradas !== '') {
          entradasParagraph.push(
            new Paragraph({
              children: [
                new TextRun({
                  text:
                    lastPerson + ' (' + recuentoEntradas + ') = ' + entradas,
                  font: 'Arial',
                  size: 12 * 2, // Tamaño en puntos, multiplicado por 2
                }),
              ],
            })
          );
        }

        lastPerson = persona.asignadoA;
        recuentoEntradas = persona.butacas.length;
        entradas = 'F' + persona.fila + ', ' + this.extract(persona.butacas);
      } else {
        recuentoEntradas += persona.butacas.length;
        entradas +=
          ' + F' + persona.fila + ', ' + this.extract(persona.butacas);
      }
    });
    entradasParagraph.push(
      new Paragraph({
        children: [
          new TextRun({
            text: lastPerson + ' (' + recuentoEntradas + ') = ' + entradas,
            font: 'Arial',
            size: 12 * 2, // Tamaño en puntos, multiplicado por 2
          }),
        ],
      })
    );
    return entradasParagraph;
  }

  extract(array: number[]): string {
    if (array.length > 0) {
      array.sort((a, b) => a - b);
      let result = '';
      let last = array[0];
      let start = last;
      let count = 1;
      for (let i = 1; i < array.length; i++) {
        if (array[i] - last === 2) {
          count++;
          last = array[i];
        } else {
          if (start === last) {
            result += start + ' (' + count + '), ';
          } else {
            result += start + '-' + last + ' (' + count + '), ';
          }
          start = last = array[i];
        }
      }
      if (start === last) {
        result += start + ' (' + count + ')';
      } else {
        result += start + '-' + last + ' (' + count + ')';
      }
      return 'BB ' + result;
    }
    return '';
  }
}
