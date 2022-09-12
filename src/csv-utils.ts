import { parse, stringify } from 'csv';
import { Repository } from './interfaces/repository.interface';
import fs from 'fs';

export async function CSVtoObject(): Promise<Repository[]> {
  return new Promise((resolve, reject) => {
    const records: Repository[] = [];
    fs.createReadStream('./data/github-ranking-2022-09-12.csv')
      .pipe(
        parse({
          delimiter: ',',
          columns: true,
        })
      )
      .on('data', function (repository: Repository) {
        repository.rank = Number(repository.rank);
        repository.stars = Number(repository.stars);
        repository.forks = Number(repository.forks);
        repository.issues = Number(repository.issues);
        repository.last_commit = new Date(repository.last_commit);
        records.push(repository);
      })
      .on('end', function () {
        resolve(records);
      })
      .on('error', function (err) {
        reject(err);
      });
  });
}

export function ObjectToCSVStringify(
  repositories: Repository[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    const outValues = repositories.map((r) => {
      r.item = `<b>${r.item}</b>`;
      return Object.values(r);
    });
    stringify(outValues, { record_delimiter: '\n' }, (err, out) => {
      if (err) {
        reject(err);
      }

      const result =
        out.length > 0
          ? (() => {
              let finalHtml = `<h1>List top repos</h1>`;
              finalHtml += `<ul>${out
                .split('\n')
                .map((o, index, arr) => {
                  if (index !== arr.length - 1) {
                    return `<li>${o}.</li>`;
                  }
                })
                .join('')}</ul>`;
              return finalHtml;
            })()
          : 'not found any repo with those criteria';
      resolve(result);
    });
  });
}
