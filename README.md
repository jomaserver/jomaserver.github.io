# Blog - Jomaserver

Este repositório guarda o código-fonte, os textos e a estrutura do meu blog pessoal. Na prática, ele funciona como o meu caderno de laboratório digital: é aqui que eu documento os pipelines de montagem genômica e os problemas reais do dia a dia rodando análises. Tem também alguns ensaios e anotações soltas sobre Linux, biologia molecular, estatística e filosofia.

## Contexto das análises

Grande parte do material mais técnico que publico aqui vem do meu trabalho de montagem e anotação do genoma tetraploide do capim-andropogon (*Andropogon gayanus*). 

Como rodo os pipelines no servidor do grupo, os caminhos de diretório, variáveis de ambiente e as configurações que aparecem nos posts refletem diretamente a estrutura desse cluster.

## O que tem por aqui

* **Montagem e curadoria:** Uso de leituras PacBio HiFi no Hifiasm, limpeza de redundância de haplótipos com Purge Dups e avaliação de k-mers com Merqury.
* **Limpeza e organelas:** Separação de DNA nuclear e contaminantes usando Kraken2, BlobToolKit e MitoHiFi.
* **Anotação genômica:** Mascaramento de transposons (AnnoTEP/EDTA) e predição de genes misturando ferramentas ab initio (Tiberius, Helixer, ANNEVO) com evidências de homologia (BRAKER3, Miniprot).
* **Consenso:** EVM para juntar as predições e gerar os modelos gênicos definitivos.
* **Troubleshooting no terminal:** Resolução de bugs no HPC, scripts quebrando por conflito no Conda, parâmetros e ajustes.
* **Customização do site:** O código fonte inclui também as estilizações front-end que fiz, como o `genome-rain.css` e as fontes locais.

## Estrutura de pastas

Seguindo a árvore do repositório, a organização principal é essa:

* `posts/`: Onde ficam as pastas com os arquivos originais das postagens, separados por temas como `Genômica`, `computacao`, `linux`, `filosofia`, `pibic` e `neurociencia`.
* `images/`: Todos os gráficos gerados nas análises (espectros do Merqury, Krona, Blobtools) e os prints de tela.
* Arquivos na raiz: Estrutura HTML/CSS/JS base, metadados (`listings.json`, `search.json`) e os arquivos de configuração do gerador estático.

## sobre os scripts

Os blocos de código Bash e Python que eu deixo nos posts não são genéricos, eles refletem execuções reais. Se você for reaproveitar algum pipeline para o seu trabalho, não esqueça de trocar os caminhos absolutos e mapear os diretórios do Docker ou do Conda pra realidade da sua máquina, senão nada vai rodar.
