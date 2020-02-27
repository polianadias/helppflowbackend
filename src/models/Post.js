const mongoose = require("mongoose");
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACESS_KEY });

const MarkupSchema = new mongoose.Schema({
  codigoBarras: String,
  tipoProduto: String,
  descricao: String,
  precoCusto: String,
  precoVendaVarejo: String,
  precoVendaAtacado: String,
  quantidadeMinimaAtacado: String,
  unidade: String,
  ativo: String,
  categoriaProduto: String,
  subcategoriaProduto: String,
  movimentaEstoque: String,
  estoqueMinimo: String,
  quantidadeEstoque: String,
  marca: String,
  modelo: String,
  codigoBalanca: String,
  codigoInterno: String,
  tipo: String,
  ncm: String,
  origem: String,
  cest: String,
  categoriaPdv: String,
  botaoPdv: String,
  categoriaLojaVirtual: String,
  subcategorialojaVirtual: String,
  nomeLojaVirtual: String,
  precoDe: String,
  precoPor: String,
  altura: String,
  largura: String,
  profundidade: String,
  peso: String,
  descricaoProduto: String,
  garantia: String,
  itensInclusos: String,
  especificacoes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const PostSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

PostSchema.pre("save", function () {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`;
  }
});

MarkupSchema.pre("save", function () {
  this.codigoBarras = "teste"
})

PostSchema.pre("remove", function () {
  if (process.env.STORAGE_TYPE === "s3") {
    return s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: this.key
      })
      .promise()
      .then(response => {
        console.log(response.status);
      })
      .catch(response => {
        console.log(response.status);
      });
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
    );
  }
});

module.exports = mongoose.model("Post", MarkupSchema);
