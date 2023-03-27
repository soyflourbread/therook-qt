export class Piece {
    constructor(componentConstructor) {
        this.componentConstructor = componentConstructor;
        this.pieceVec = Array(64).fill(null);
    }

    connect(boardCon) {
        const this_out = this;
        boardCon.placePiece.connect(function (id, square) {
            this_out.place(
                id, square
            );
        });
        boardCon.movePiece.connect(function (src, dest) {
            this_out.move(src, dest);
        });
        boardCon.removePiece.connect(function (square) {
            this_out.remove(square);
        });
        boardCon.resetBoard.connect(function () {
            this_out.reset()
        })
    }

    remove(square) {
        const piece = this.pieceVec[square];
        if (piece == null) return;
        this.pieceVec[square] = null;
        piece.destroy();
    }

    place(id, square) {
        this.remove(square);

        const new_piece = this.componentConstructor(id, square);
        this.pieceVec[square] = new_piece;
    }

    move(src, dest) {
        const srcPiece = this.pieceVec[src];
        if (srcPiece == null) return;

        this.remove(dest);

        srcPiece.animationEnabled = true;
        srcPiece.square = dest;
        srcPiece.animationEnabled = false;

        this.pieceVec[src] = null;
        this.pieceVec[dest] = srcPiece;
    }

    reset() {
        const prevPieceVec = this.pieceVec;
        this.pieceVec = Array(64).fill(null);
        for (const piece of prevPieceVec) {
            if (piece != null) {
                piece.destroy();
            }
        }
    }
}