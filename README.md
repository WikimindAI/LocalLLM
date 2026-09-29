<div align="center">

<img src="assets/banner.svg" alt="L3M → LLLM → Local LLM" width="100%"/>

**Fais tourner des LLM en local, sans cloud, sans abonnement.**
Tu donnes ta config (GPU, CPU, RAM, SSD), on te dit quelle classe de modèles ton PC encaisse, avec les liens et les tailles.

![Modèles](https://img.shields.io/badge/mod%C3%A8les-25-blue)
![Format](https://img.shields.io/badge/format-GGUF-purple)
![Licence](https://img.shields.io/badge/licence-MIT-green)

</div>

---

## Sommaire

- [Comment ça marche](#comment-ça-marche)
- [Les classes de modèles](#les-classes-de-modèles)
- [Le calcul](#le-calcul)
- [Les modèles référencés](#les-modèles-référencés)
- [Démarrage rapide](#démarrage-rapide)
- [Structure du dépôt](#structure-du-dépôt)
- [Contribuer](#contribuer)

---

## Comment ça marche

1. Tu renseignes ta configuration dans l'interface :
   - **GPU** (ou `none` si tu n'en as pas)
   - **CPU**
   - **RAM**
   - **SSD** (espace libre)
2. L'interface calcule ta **classe** (de `A1` à `A120`).
3. Elle affiche tous les modèles de ta classe et des classes inférieures, avec leurs quantifications, leur taille et le lien de téléchargement.
4. Tu télécharges le `.gguf` et tu le lances avec `llama.cpp`, Ollama ou LM Studio (voir [Démarrage rapide](#démarrage-rapide)).

---

## Les classes de modèles

Le chiffre de la classe = nombre maximum de **milliards de paramètres**.
`A1` = 1B ou moins, `A2` = 2B ou moins, `A3` = 3B ou moins, etc.

| Classe | Params max | RAM min (CPU seul) | VRAM min (GPU) | SSD min | Pour faire quoi |
|:------:|:----------:|:------------------:|:--------------:|:-------:|-----------------|
| **A1**   | ≤ 1B   | 4 Go  | 2 Go  | 1 Go  | Tests, très vieux PC, tâches simples |
| **A2**   | ≤ 2B   | 4 Go  | 3 Go  | 2 Go  | Chat basique, résumés courts |
| **A3**   | ≤ 3B   | 6 Go  | 4 Go  | 3 Go  | Assistant léger |
| **A4**   | ≤ 4B   | 8 Go  | 6 Go  | 3 Go  | Bon compromis sur PC modeste |
| **A8**   | ≤ 8B   | 16 Go | 8 Go  | 6 Go  | Usage quotidien confortable |
| **A14**  | ≤ 14B  | 16 Go | 12 Go | 10 Go | Raisonnement, code, meilleure qualité |
| **A32**  | ≤ 32B  | 32 Go | 24 Go | 20 Go | Très bon niveau, poste costaud |
| **A70**  | ≤ 70B  | 64 Go | 48 Go | 45 Go | Station de travail |
| **A120** | ≤ 120B | 96 Go | 80 Go | 70 Go | Très gros modèles, machine dédiée |

> Les valeurs du tableau sont calculées pour la quantification **Q4_K_M**, le meilleur rapport qualité/taille dans la plupart des cas.
> La classe se base sur le **nombre réel de paramètres** : un « 8B » qui fait 8,2 milliards de paramètres tombe en `A14`. C'est voulu, pour que la classe reste une borne fiable.

---

## Le calcul

Pour chaque modèle et chaque quantification :

```text
mémoire_nécessaire = taille_du_fichier + 1,5 Go        (contexte + surcoût moteur)

mémoire_disponible = RAM − 2 Go                        (si GPU = none, on réserve 2 Go pour le système)
                   = VRAM                              (si tu as un GPU)

ça passe si :  mémoire_nécessaire ≤ mémoire_disponible
               ET  taille_du_fichier ≤ SSD libre
```

Un modèle plus gros que ta VRAM mais qui tient dans ta RAM peut tourner en **offload partiel** (une partie des couches sur le GPU, le reste sur le CPU), plus lent mais utilisable.

**Pour les modèles MoE** (marqués `moe`), comme `Qwen3-30B-A3B` ou `gpt-oss-20b` : seuls quelques paramètres sont actifs par token, donc ils sont rapides, mais le modèle **entier** doit tenir en mémoire. C'est la taille du fichier qui compte pour le calcul.

Toutes ces données sont dans [`models.json`](models.json).

---

## Les modèles référencés

Tailles approximatives en **Q4_K_M** (voir `models.json` pour toutes les quantifications). Les liens pointent vers les dépôts Hugging Face contenant les fichiers GGUF.

### A1 à A4 : PC modestes

| Modèle | Fournisseur | Classe | Taille Q4_K_M | Lien |
|--------|-------------|:------:|:-------------:|------|
| Qwen3 0.6B | Alibaba (Qwen) | A1 | 0,40 Go | [Télécharger](https://huggingface.co/unsloth/Qwen3-0.6B-GGUF) |
| Gemma 3 1B | Google | A1 | 0,81 Go | [Télécharger](https://huggingface.co/unsloth/gemma-3-1b-it-GGUF) |
| Llama 3.2 1B | Meta | A2 | 0,81 Go | [Télécharger](https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF) |
| Qwen3 1.7B | Alibaba (Qwen) | A2 | 1,11 Go | [Télécharger](https://huggingface.co/unsloth/Qwen3-1.7B-GGUF) |
| SmolLM2 1.7B | Hugging Face | A2 | 1,06 Go | [Télécharger](https://huggingface.co/bartowski/SmolLM2-1.7B-Instruct-GGUF) |
| SmolLM3 3B | Hugging Face | A3 | 1,92 Go | [Télécharger](https://huggingface.co/unsloth/SmolLM3-3B-GGUF) |
| Llama 3.2 3B | Meta | A4 | 2,02 Go | [Télécharger](https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF) |
| Phi-4 mini | Microsoft | A4 | 2,49 Go | [Télécharger](https://huggingface.co/unsloth/Phi-4-mini-instruct-GGUF) |
| Qwen3 4B | Alibaba (Qwen) | A4 | 2,50 Go | [Télécharger](https://huggingface.co/unsloth/Qwen3-4B-GGUF) |

### A8 à A14 : PC récents

| Modèle | Fournisseur | Classe | Taille Q4_K_M | Lien |
|--------|-------------|:------:|:-------------:|------|
| Gemma 3 4B (vision) | Google | A8 | 2,49 Go | [Télécharger](https://huggingface.co/unsloth/gemma-3-4b-it-GGUF) |
| Mistral 7B v0.3 | Mistral AI | A8 | 4,37 Go | [Télécharger](https://huggingface.co/bartowski/Mistral-7B-Instruct-v0.3-GGUF) |
| Qwen2.5 Coder 7B (code) | Alibaba (Qwen) | A8 | 4,68 Go | [Télécharger](https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct-GGUF) |
| Llama 3.1 8B | Meta | A14 | 4,92 Go | [Télécharger](https://huggingface.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF) |
| Qwen3 8B | Alibaba (Qwen) | A14 | 5,03 Go | [Télécharger](https://huggingface.co/unsloth/Qwen3-8B-GGUF) |
| Gemma 3 12B (vision) | Google | A14 | 7,30 Go | [Télécharger](https://huggingface.co/unsloth/gemma-3-12b-it-GGUF) |

### A32 : gros PC / GPU 24 Go

| Modèle | Fournisseur | Classe | Taille | Lien |
|--------|-------------|:------:|:------:|------|
| Qwen3 14B | Alibaba (Qwen) | A32 | 9,00 Go | [Télécharger](https://huggingface.co/unsloth/Qwen3-14B-GGUF) |
| Phi-4 14B | Microsoft | A32 | 9,05 Go | [Télécharger](https://huggingface.co/bartowski/phi-4-GGUF) |
| gpt-oss 20B (MoE) | OpenAI | A32 | 12,1 Go (MXFP4) | [Télécharger](https://huggingface.co/ggml-org/gpt-oss-20b-GGUF) |
| Mistral Small 3.2 24B | Mistral AI | A32 | 14,3 Go | [Télécharger](https://huggingface.co/unsloth/Mistral-Small-3.2-24B-Instruct-2506-GGUF) |
| Gemma 3 27B (vision) | Google | A32 | 16,5 Go | [Télécharger](https://huggingface.co/unsloth/gemma-3-27b-it-GGUF) |
| Qwen3 30B-A3B (MoE) | Alibaba (Qwen) | A32 | 18,6 Go | [Télécharger](https://huggingface.co/unsloth/Qwen3-30B-A3B-GGUF) |
| Qwen3 Coder 30B-A3B (code, MoE) | Alibaba (Qwen) | A32 | 18,6 Go | [Télécharger](https://huggingface.co/unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF) |

### A70 à A120 : stations de travail

| Modèle | Fournisseur | Classe | Taille | Lien |
|--------|-------------|:------:|:------:|------|
| Qwen3 32B | Alibaba (Qwen) | A70 | 19,8 Go | [Télécharger](https://huggingface.co/unsloth/Qwen3-32B-GGUF) |
| Llama 3.3 70B | Meta | A120 | 42,5 Go | [Télécharger](https://huggingface.co/bartowski/Llama-3.3-70B-Instruct-GGUF) |
| gpt-oss 120B (MoE) | OpenAI | A120 | 63,4 Go (MXFP4) | [Télécharger](https://huggingface.co/ggml-org/gpt-oss-120b-GGUF) |

### Quelle quantification choisir ?

| Quant | Qualité | Taille | Quand la choisir |
|-------|:-------:|:------:|------------------|
| **Q4_K_M** | Bonne | Petite | Le choix par défaut |
| **Q6_K** | Très bonne | Moyenne | Si tu as de la marge en mémoire |
| **Q8_0** | Quasi identique à l'original | Grande | Si la mémoire n'est pas un souci |

---

## Démarrage rapide

### Option 1 : llama.cpp

```bash
# 1. Installer llama.cpp (voir https://github.com/ggml-org/llama.cpp)
# 2. Télécharger un modèle GGUF depuis Hugging Face (ex. Qwen3 4B, Q4_K_M)
# 3. Lancer un serveur local
llama-server -m Qwen3-4B-Q4_K_M.gguf -c 4096 --port 8080
# → API compatible OpenAI sur http://localhost:8080
```

Sans GPU, ça tourne tel quel sur le CPU. Avec GPU, ajoute `-ngl 99` pour décharger un maximum de couches dessus.

### Option 2 : Ollama

```bash
ollama run qwen3:4b
```

### Option 3 : LM Studio

Interface graphique : cherche le modèle dans l'onglet de recherche, choisis la quantification, télécharge, discute.

### Utiliser l'interface Local LLM

Ouvre `index.html` (ou la page GitHub Pages du projet), saisis ta config, et récupère ta classe et la liste des modèles compatibles.

---

## Structure du dépôt

```text
local-llm/
├── README.md
├── models.json          # Base des modèles (classes, quantifications, tailles, liens)
└── assets/
    └── banner.svg       # Bandeau animé L3M → LLLM → Local LLM
```

---

## Contribuer

Pour ajouter un modèle, ajoute une entrée dans `models.json` :

```json
{
  "id": "nom-du-modele",
  "name": "Nom du modèle",
  "provider": "Créateur",
  "gguf_by": "Auteur des GGUF",
  "params_b": 7.0,
  "class": "A8",
  "tags": ["chat"],
  "quantizations": [
    { "quant": "Q4_K_M", "size_gb": 4.2 }
  ],
  "repo_url": "https://huggingface.co/..."
}
```

Règles : la classe est la plus petite dont `max_params_b ≥ params_b`, les tailles viennent de la page Hugging Face, et chaque lien doit être testé.

---

## Licence

MIT. Les modèles restent soumis à leurs licences respectives : vérifie-les avant tout usage commercial.


## Contributors

<a href="https://github.com/localsend/localsend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=localsend/localsend"  alt="Localsend Contributors"/>
</a>
