import { DatePipe, UpperCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Butaca, Zona_entresuelo, Zona_patio } from '@api/types/butacas';
import { Plano } from '@api/types/plano';
import { Representacion } from '@api/types/representacion';
import {
  AlignmentType,
  Document,
  Packer,
  PageOrientation,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  UnderlineType,
} from 'docx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class PlanoWordService {
  constructor(
    private readonly datePipe: DatePipe,
    private readonly upperCasePipe: UpperCasePipe
  ) {}

  generateDocument(representacion: Representacion, plano: Plano) {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE,
              },
            },
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: this.upperCasePipe.transform(
                    'Plano ' +
                      representacion?.obra?.name +
                      ' ' +
                      this.datePipe.transform(
                        representacion?.fecha,
                        "EEEE dd 'de' MMMM"
                      ) +
                      ' ' +
                      Zona_patio.toUpperCase()
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
            ...this.getPlanoTable(plano.butacas, 12),
          ],
        },
        {
          properties: {
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE,
              },
            },
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: this.upperCasePipe.transform(
                    'Plano ' +
                      representacion?.obra?.name +
                      ' ' +
                      this.datePipe.transform(
                        representacion?.fecha,
                        "EEEE dd 'de' MMMM"
                      ) +
                      ' ' +
                      Zona_entresuelo.toUpperCase()
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
            ...this.getPlanoTable(plano.butacas, 0, 12),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(
        blob,
        'Plano ' +
          representacion?.obra?.name +
          '_' +
          representacion?.fecha +
          '_' +
          representacion?.sesion +
          '.docx'
      );
    });
  }

  getPlanoTable(butacas: Butaca[][], start: number, end?: number): Table[] {
    const table = new Table({ columnWidths: [91], rows: [] });

    butacas.slice(start, end).forEach((fila) => {
      const tableRow = new TableRow({
        children: [],
        height: { value: '6mm', rule: 'exact' },
      });
      fila.forEach((butaca) => {
        if (butaca?.estado === 'Pasillo' || butaca?.estado === 'Vacia') {
          tableRow.addChildElement(
            new TableCell({
              width: {
                size: start === 0 ? '7.7mm' : '9mm',
              },
              borders: {
                bottom: { style: 'nil' },
                top: { style: 'nil' },
                left: { style: 'nil' },
                right: { style: 'nil' },
              },
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text:
                        butaca.estado === 'Pasillo'
                          ? 'F' + butaca.fila.toString()
                          : '',
                      font: 'Arial',
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            })
          );
        } else {
          tableRow.addChildElement(
            new TableCell({
              width: {
                size: start === 0 ? '7.7mm' : '9mm',
              },
              shading: {
                fill: butaca?.estado === 'Ocupada' ? '#ffff00' : '#ffffff',
              },
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: butaca.num_butaca.toString(),
                      font: 'Arial',
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            })
          );
        }
      });
      if (fila.length === 0) {
        tableRow.addChildElement(
          new TableCell({
            width: {
              size: start === 0 ? '7.7mm' : '9mm',
            },
            borders: {
              bottom: { style: 'nil' },
              top: { style: 'nil' },
              left: { style: 'nil' },
              right: { style: 'nil' },
            },
            children: [new Paragraph('')],
          })
        );
      }
      table.addChildElement(tableRow);
    });

    return [table];
  }
}
